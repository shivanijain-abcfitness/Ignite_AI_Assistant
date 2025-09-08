package spring.ai.model.spring_ai_model.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import spring.ai.model.spring_ai_model.model.Chunk;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QdrantVectorStoreService {

    private final WebClient webClient;
    private final String collectionName = "documents";

    public QdrantVectorStoreService() {
        this.webClient = WebClient.builder()
                                  .baseUrl("http://localhost:6333")
                                  .build();
    }

    /**
     * Check if collection exists by GET /collections/{collection}
     */
    public Mono<Boolean> collectionExists() {
        return webClient.get()
                        .uri("/collections/{collection}", collectionName)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .map(resp -> true)
                        .onErrorResume(err -> {
                            if (err instanceof WebClientResponseException.NotFound) {
                                return Mono.just(false);
                            }
                            return Mono.error(err);
                        });
    }

    public Mono<Void> createCollectionIfNotExists(int vectorSize) {
        return collectionExists()
            .flatMap(exists -> {
                if (exists) return Mono.empty();

                Map<String, Object> requestBody = Map.of(
                    "vectors", Map.of(
                        "size", vectorSize,
                        "distance", "Cosine"
                    )
                );

                return webClient.put()
                                .uri("/collections/{collection}", collectionName)
                                .bodyValue(requestBody)
                                .retrieve()
                                .bodyToMono(Void.class);
            });
    }

    public Mono<Void> saveChunk(Chunk chunk) {
        Map<String, Object> point = Map.of(
            "id", chunk.getId(),
            "vector", chunk.getEmbedding(),
            "payload", Map.of("text", chunk.getText())
        );

        Map<String, Object> requestBody = Map.of("points", List.of(point));

        System.out.println("Saving chunk with ID: " + chunk.getId());
        System.out.println("Payload: " + chunk.getText());
        System.out.println("Embedding length: " + chunk.getEmbedding().length);

        return webClient.put()
                        .uri("/collections/{collection}/points", collectionName)
                        .bodyValue(requestBody)
                        .retrieve()
                        .bodyToMono(Void.class)
                        .doOnSuccess(v -> System.out.println("Saved chunk: " + chunk.getId()))
                        .doOnError(e -> System.err.println("Error saving chunk: " + e.getMessage()));
    }


    public Mono<Void> saveChunks(List<Chunk> chunks) {
        List<Map<String, Object>> points = chunks.stream().map(chunk -> Map.of(
            "id", chunk.getId(),
            "vector", chunk.getEmbedding(),
            "payload", Map.of("text", chunk.getText())
        )).collect(Collectors.toList());

        Map<String, Object> requestBody = Map.of("points", points);

        return webClient.put()
                        .uri("/collections/{collection}/points", collectionName)
                        .bodyValue(requestBody)
                        .retrieve()
                        .bodyToMono(Void.class);
    }


    public Mono<List<Chunk>> searchRelevantChunks(float[] queryEmbedding, int topK) {
        Map<String, Object> searchRequest = Map.of(
            "vector", queryEmbedding,
            "top", topK,
            "with_payload", true,
            "with_vector", true
        );
        System.out.println(searchRequest);
        return webClient.post()
                        .uri("/collections/{collection}/points/search", collectionName)
                        .bodyValue(searchRequest)
                        .retrieve()
                        .bodyToMono(QdrantSearchResponse.class)
                        .map(this::mapToChunks);
    }


    private List<Chunk> mapToChunks(QdrantSearchResponse response) {
        if (response == null || response.getResult() == null) {
            return Collections.emptyList();
        }

        return response.getResult().stream()
                       .map(point -> {
                           if (point == null || point.getPayload() == null || !point.getPayload().containsKey("text")) {
                               System.err.println("⚠️ Invalid point received from Qdrant: " + point);
                               return null;
                           }

                           Chunk chunk = new Chunk();
                           chunk.setId(point.getId());
                           chunk.setText(point.getPayload().get("text").toString());
                           chunk.setEmbedding(point.getVector());
                           return chunk;
                       })
                       .filter(Objects::nonNull)
                       .collect(Collectors.toList());
    }


    public static class QdrantSearchResponse {
        private List<QdrantPoint> result;

        public List<QdrantPoint> getResult() {
            return result;
        }

        public void setResult(List<QdrantPoint> result) {
            this.result = result;
        }
    }

    public static class QdrantPoint {
        private String id;
        private Map<String, Object> payload;
        private float[] vector;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public Map<String, Object> getPayload() {
            return payload;
        }

        public void setPayload(Map<String, Object> payload) {
            this.payload = payload;
        }

        public float[] getVector() {
            return vector;
        }

        public void setVector(float[] vector) {
            this.vector = vector;
        }
    }
}
