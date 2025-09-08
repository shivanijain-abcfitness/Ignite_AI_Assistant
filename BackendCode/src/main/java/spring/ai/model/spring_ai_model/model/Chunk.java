package spring.ai.model.spring_ai_model.model;
import java.util.Arrays;

public class Chunk {
    private String id;
    private String text;
    private float[] embedding;

    public Chunk() {
        // Default constructor for serialization
    }

    public Chunk(String id, String text, float[] embedding) {
        this.id = id;
        this.text = text;
        this.embedding = embedding;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public float[] getEmbedding() {
        return embedding;
    }

    public void setEmbedding(float[] embedding) {
        this.embedding = embedding;
    }

    @Override
    public String toString() {
        return "Chunk{" +
               "id='" + id + '\'' +
               ", text='" + (text.length() > 30 ? text.substring(0, 30) + "..." : text) + '\'' +
               ", embedding=" + Arrays.toString(Arrays.copyOf(embedding, Math.min(embedding.length, 5))) + "..." +
               '}';
    }
}

