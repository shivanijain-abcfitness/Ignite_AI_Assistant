package spring.ai.model.spring_ai_model.service;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import spring.ai.model.spring_ai_model.model.Chunk;

import java.util.List;

@Service
public class ChatService {

    private final EmbeddingClient embeddingClient;
    private final QdrantVectorStoreService vectorStoreService;
    private final LMStudioClient lmStudioClient;

    public ChatService(EmbeddingClient embeddingClient,
                       QdrantVectorStoreService vectorStoreService,
                       LMStudioClient lmStudioClient) {
        this.embeddingClient = embeddingClient;
        this.vectorStoreService = vectorStoreService;
        this.lmStudioClient = lmStudioClient;
    }

    public Mono<String> answerQuestion(String question) {
        return embeddingClient.getEmbedding(question)
                .flatMap(embedding -> {
                    Mono<List<Chunk>> relevantChunks = vectorStoreService.searchRelevantChunks(embedding, 3);
                    String prompt = buildPrompt(question, (List<Chunk>) relevantChunks);
                    return lmStudioClient.queryModel(prompt);
                });
    }

    private String buildPrompt(String question, List<Chunk> chunks) {
        StringBuilder promptBuilder = new StringBuilder();
        for (Chunk chunk : chunks) {
            promptBuilder.append("Context: ").append(chunk.getText()).append("\n");
        }
        promptBuilder.append("Question: ").append(question);
        return promptBuilder.toString();
    }
}