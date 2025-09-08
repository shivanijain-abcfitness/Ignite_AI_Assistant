package spring.ai.model.spring_ai_model.model;

public class EmbeddingRequest {

    private String model = "text-embedding-nomic-embed-text-v1.5";  // e.g. "text-embedding-3-large"
    private String input;

    public EmbeddingRequest(String input) {
        this.input = input;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }
}
