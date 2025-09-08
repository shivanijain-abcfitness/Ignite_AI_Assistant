package spring.ai.model.spring_ai_model.service;

import org.springframework.stereotype.Service;
import spring.ai.model.spring_ai_model.model.Chunk;

import java.util.ArrayList;
import java.util.List;

@Service
public class VectorStoreService {

    private final List<Chunk> chunks = new ArrayList<>();

    public void saveChunk(Chunk chunk) {
        chunks.add(chunk);
    }

    public List<Chunk> searchRelevantChunks(float[] queryEmbedding, int topK) {
        // Simple stub: return first topK chunks (no actual vector search)
        return chunks.stream().limit(topK).toList();
    }
}