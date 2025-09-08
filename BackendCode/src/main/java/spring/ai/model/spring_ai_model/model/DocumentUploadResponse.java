package spring.ai.model.spring_ai_model.model;


public class DocumentUploadResponse {
    private String message;
    private int chunkCount;

    public DocumentUploadResponse(String message, int chunkCount) {
        this.message = message;
        this.chunkCount = chunkCount;
    }

    public String getMessage()
    {
        return message;
    }

    public void setMessage( String message )
    {
        this.message = message;
    }

    public int getChunkCount()
    {
        return chunkCount;
    }

    public void setChunkCount( int chunkCount )
    {
        this.chunkCount = chunkCount;
    }
}
