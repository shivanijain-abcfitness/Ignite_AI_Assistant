package spring.ai.model.spring_ai_model.model;


public class ChatResponse {
    private String answer;

    public ChatResponse(String answer) {
        this.answer = answer;
    }

    public String getAnswer()
    {
        return answer;
    }

    public void setAnswer( String answer )
    {
        this.answer = answer;
    }
}

