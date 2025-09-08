package spring.ai.model.spring_ai_model.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import spring.ai.model.spring_ai_model.model.EmbeddingRequest;
import spring.ai.model.spring_ai_model.model.EmbeddingResponse;

@Service
public class EmbeddingClient {

    private final WebClient webClient;

    public EmbeddingClient(@Value("${lmstudio.base-url}") String baseUrl) {
        this.webClient = WebClient.builder()
                                  .baseUrl(baseUrl)  // e.g., "http://localhost:7860"
                                  .build();
    }

    public Mono<float[]> getEmbedding(String text) {
        return webClient.post()
                        .uri("/v1/embeddings")
                        .bodyValue(new EmbeddingRequest(text))
                        .retrieve()
                        .bodyToMono(EmbeddingResponse.class)
                        .map(EmbeddingResponse::getEmbeddingVector);
    }

    public float[] getEmbeddingSync(String text) {
        return getEmbedding(text).block();
    }
}
