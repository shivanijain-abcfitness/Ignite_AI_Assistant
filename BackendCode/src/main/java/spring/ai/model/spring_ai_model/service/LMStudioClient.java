package spring.ai.model.spring_ai_model.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import spring.ai.model.spring_ai_model.model.LMStudioRequest;
import spring.ai.model.spring_ai_model.model.LMStudioResponse;

@Service
public class LMStudioClient {

    private final WebClient webClient;

    public LMStudioClient(WebClient.Builder webClientBuilder,
        @Value("${lmstudio.base-url}") String baseUrl) {
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
    }

    public Mono<String> queryModel(String prompt) {
        LMStudioRequest request = new LMStudioRequest(prompt);
        return webClient.post()
                        .uri("/v1/chat/completions")
                        .bodyValue(request)
                        .retrieve()
                        .bodyToMono(LMStudioResponse.class)
                        .map(LMStudioResponse::getAnswer);
    }
}
