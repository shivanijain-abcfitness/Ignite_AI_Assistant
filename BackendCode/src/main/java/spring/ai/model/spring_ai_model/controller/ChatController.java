package spring.ai.model.spring_ai_model.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import spring.ai.model.spring_ai_model.model.Chunk;
import spring.ai.model.spring_ai_model.model.FreezeResponse;
import spring.ai.model.spring_ai_model.service.EmbeddingClient;
import spring.ai.model.spring_ai_model.service.FreezeMemberClient;
import spring.ai.model.spring_ai_model.service.LMStudioClient;
import spring.ai.model.spring_ai_model.service.QdrantVectorStoreService;

import java.time.Duration;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final EmbeddingClient embeddingClient;
    private final QdrantVectorStoreService qdrantVectorStoreService;
    private final LMStudioClient lmStudioClient;
    private final FreezeMemberClient freezeMemberClient;

    private static final Map<String, Map<String, String>> sessions = new HashMap<>();

    public ChatController(EmbeddingClient embeddingClient,
        QdrantVectorStoreService qdrantVectorStoreService,
        LMStudioClient lmStudioClient,
        FreezeMemberClient freezeMemberClient) {
        this.embeddingClient = embeddingClient;
        this.qdrantVectorStoreService = qdrantVectorStoreService;
        this.lmStudioClient = lmStudioClient;
        this.freezeMemberClient = freezeMemberClient;
    }

    @PostMapping("/query")
    public Mono<String> queryHandler(
        @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
        @RequestBody QueryRequest request) {

        final String finalSessionId = (sessionId == null || sessionId.isEmpty())
                                      ? UUID.randomUUID().toString()
                                      : sessionId;

        if (request.getQuery() == null || request.getQuery().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Query must not be empty");
        }

        String userInput = request.getQuery().trim();
        logger.info("Session {}: Received query: {}", finalSessionId, userInput);

        Map<String, String> sessionData = sessions.computeIfAbsent(finalSessionId, k -> new HashMap<>());

        // Detect freeze intent
        if (isMembershipFreezeIntent(userInput, sessionData)) {
            return handleFreezeFlow(userInput, finalSessionId, sessionData);
        } else {
            return handleDocumentQuery(userInput);
        }
    }

    // ------------------- Freeze Flow -------------------
    private Mono<String> handleFreezeFlow(String userInput, String sessionId, Map<String, String> collectedFields) {
        String stage = collectedFields.getOrDefault("stage", "ask_clubNumber");

        switch (stage) {
            case "ask_clubNumber":
                if (userInput.matches("\\d+")) {
                    collectedFields.put("clubNumber", userInput.trim());
                    collectedFields.put("stage", "ask_membershipId");
                    return Mono.just("Please provide the Member Number (digits only):");
                } else {
                    return Mono.just("Please provide a valid Club Number (digits only):");
                }

            case "ask_membershipId":
                if (userInput.matches("\\d+")) {
                    collectedFields.put("membershipId", userInput.trim());
                    collectedFields.put("stage", "ask_reason");
                    return Mono.just("✍️ Please enter the reason for freezing:");
                } else {
                    return Mono.just("Please provide a valid Member Number (digits only):");
                }

            case "ask_reason":
                collectedFields.put("reason", userInput.trim());
                collectedFields.put("stage", "confirm_basic");
                return Mono.just(String.format("""
                        📝 Here is the information you provided:

                        **Club Number**: %s
                        
                        **Member Number**: %s
                        
                        **Reason**: %s

                        ❓ Please confirm: do you want to proceed? (yes/no)
                        """,
                    collectedFields.get("clubNumber"),
                    collectedFields.get("membershipId"),
                    collectedFields.get("reason")));

            case "confirm_basic":
                if (userInput.equalsIgnoreCase("yes") || userInput.equalsIgnoreCase("y")) {
                    String clubNumber = collectedFields.get("clubNumber");
                    String membershipId = collectedFields.get("membershipId");

                    return freezeMemberClient.getPaymentSchedule(clubNumber, membershipId)
                                             .map((FreezeResponse response) -> {
                                                 String dates = response.getAccountReview().stream()
                                                                        .map(entry -> "• " + entry.getDate())
                                                                        .collect(Collectors.joining("\n"));
                                                 collectedFields.put("stage", "select_date");
                                                 return String.format("""
                                        📅 Invoice Dates:
                                        %s

                                        👉 Please select the Freeze Start date from the above list.
                                        """, dates.replaceAll("(?m)^", "\n"));
                                             })
                                             .onErrorResume(ex -> {
                                                 logger.error("Error calling freeze API", ex);
                                                 sessions.remove(sessionId);
                                                 return Mono.just("❌ Failed to get invoice dates. Please try again.");
                                             });
                } else if (userInput.equalsIgnoreCase("no") || userInput.equalsIgnoreCase("n")) {
                    sessions.remove(sessionId);
                    return Mono.just("❌ Membership freeze cancelled.");
                }
                return Mono.just("❓ Do you want to proceed with freezing this membership? (yes/no)");

            case "select_date":
                collectedFields.put("selectedDate", userInput);
                collectedFields.put("stage", "ask_payments");
                return Mono.just("💰Please enter the number of payments to freeze:");

            case "ask_payments":
                collectedFields.put("payments", userInput);
                collectedFields.put("stage", "ask_due_amount");
                return Mono.just("💵 Please enter the freeze Fee:");

            case "ask_due_amount":
                collectedFields.put("dueAmount", userInput);
                collectedFields.put("stage", "final_confirm");
                return Mono.just(String.format("""
                        ✅ Please confirm the following details before proceeding:

                        **Club Number**: %s
                        
                        **Member Number**: %s
                        
                        **Freeze Start Date**: %s
                        
                        **Number Of Payments**: %s
                        
                        **Reason**: %s
                        
                        **Freeze Fee**: %s

                        ❓ Do you want to proceed with freezing this membership? (yes/no)
                        """,
                    collectedFields.get("clubNumber"),
                    collectedFields.get("membershipId"),
                    collectedFields.get("selectedDate"),
                    collectedFields.get("payments"),
                    collectedFields.get("reason"),
                    collectedFields.get("dueAmount")));

            case "final_confirm":
                if (userInput.equalsIgnoreCase("yes") || userInput.equalsIgnoreCase("y")) {
                    Map<String, Object> payload = new HashMap<>();
                    payload.put("clubNumber", collectedFields.get("clubNumber"));
                    payload.put("memberNumber", collectedFields.get("membershipId"));
                    payload.put("freezeStartDate", collectedFields.get("selectedDate"));
                    payload.put("numberOfPayments", Integer.parseInt(collectedFields.get("payments")));
                    payload.put("duesFreezeAmount", Double.parseDouble(collectedFields.get("dueAmount")));
                    payload.put("freezeTypeCode", "FRZ");
                    payload.put("authorizedBy", "abctech");
                    payload.put("comment", "");
                    payload.put("reason", collectedFields.get("reason"));
                    payload.put("includeFees", false);
                    payload.put("zeroDuesAmounts", false);
                    payload.put("exceptionPoints", new ArrayList<>());

                    sessions.remove(sessionId);

                    // Call API asynchronously
                    logger.info("Submitting freeze payload: {}", payload);

                    return freezeMemberClient.submitFreeze(payload)
                                             .map(response -> "🎉 Membership Freeze successful!")
                                             .onErrorResume(ex -> {
                                                 logger.error("Error calling transfer API", ex);
                                                 return Mono.just("❌ Membership freeze failed. Please try again.");
                                             });
                } else if (userInput.equalsIgnoreCase("no") || userInput.equalsIgnoreCase("n")) {
                    sessions.remove(sessionId);
                    return Mono.just("❌ Membership freeze cancelled.");
                }
                return Mono.just("❓ Please confirm final freeze request: (yes/no)");

            default:
                sessions.remove(sessionId);
                return Mono.just("⚠️ Something went wrong. Restarting flow...");
        }
    }

    private boolean isMembershipFreezeIntent(String input, Map<String, String> sessionData) {
        String lower = input.toLowerCase();
        boolean matchesKeywords = lower.contains("freeze") || lower.contains("freezing");
        boolean sessionInProgress = sessionData.containsKey("clubNumber") || sessionData.containsKey("membershipId");
        boolean isNumber = input.matches("\\d+");

        return matchesKeywords || sessionInProgress || isNumber;
    }

    // ------------------- Document Query -------------------
    private Mono<String> handleDocumentQuery(String userInput) {
        return embeddingClient.getEmbedding(userInput)
                              .flatMap(embedding -> qdrantVectorStoreService.searchRelevantChunks(embedding, 3))
                              .map(chunks -> chunks.stream().map(Chunk::getText).collect(Collectors.joining("\n\n")))
                              .flatMap(context -> lmStudioClient.queryModel(String.format("""
                        Use the context below to answer the user's question.

                        Context:
                        %s

                        Question:
                        %s
                        """, context, userInput)));
    }

    public static class QueryRequest {
        private String query;
        public String getQuery() { return query; }
        public void setQuery(String query) { this.query = query; }
    }
}
