package spring.ai.model.spring_ai_model.controller;

import org.apache.tika.exception.TikaException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import spring.ai.model.spring_ai_model.model.DocumentUploadResponse;
import spring.ai.model.spring_ai_model.service.DocumentIngestionService;
import spring.ai.model.spring_ai_model.service.TextChunkingService;
import spring.ai.model.spring_ai_model.service.EmbeddingClient;
import spring.ai.model.spring_ai_model.service.QdrantVectorStoreService;
import spring.ai.model.spring_ai_model.model.Chunk;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentIngestionService ingestionService;
    private final TextChunkingService chunkingService;
    private final EmbeddingClient embeddingClient;
    private final QdrantVectorStoreService qdrantVectorStoreService;

    public DocumentController(DocumentIngestionService ingestionService,
        TextChunkingService chunkingService,
        EmbeddingClient embeddingClient,
        QdrantVectorStoreService qdrantVectorStoreService) {
        this.ingestionService = ingestionService;
        this.chunkingService = chunkingService;
        this.embeddingClient = embeddingClient;
        this.qdrantVectorStoreService = qdrantVectorStoreService;
    }

    @PostMapping("/upload")
    public ResponseEntity<DocumentUploadResponse> uploadDocument(@RequestParam("file") MultipartFile file) throws IOException, TikaException {
        // Save multipart file temporarily
        File tempFile = File.createTempFile("upload-", file.getOriginalFilename());
        file.transferTo(tempFile);

        // Extract text
        String text = ingestionService.extractText(tempFile);

        // Chunk text (e.g. 1000 chars)
        List<String> chunks = chunkingService.chunkText(text, 1000);

        if (chunks.isEmpty()) {
            return ResponseEntity.ok(new DocumentUploadResponse("No text chunks found in document", 0));
        }

        // Get embedding for first chunk to determine vector size and create collection
        float[] firstEmbedding = embeddingClient.getEmbeddingSync(chunks.get(0));
        System.out.println("Embedding length: " + firstEmbedding.length);

        // Create Qdrant collection with vector size
        qdrantVectorStoreService.createCollectionIfNotExists(firstEmbedding.length).block();

        // Save all chunks
        for (String chunkText : chunks) {
            float[] embedding = embeddingClient.getEmbeddingSync(chunkText);

            System.out.println("Embedding length: " + embedding.length);

            Chunk chunk = new Chunk(UUID.randomUUID().toString(), chunkText, embedding);

            // Save chunk to Qdrant (block to ensure save before returning)
            qdrantVectorStoreService.saveChunk(chunk).block();
        }

        return ResponseEntity.ok(new DocumentUploadResponse("Document ingested successfully", chunks.size()));
    }
}
