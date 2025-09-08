package spring.ai.model.spring_ai_model.model;

import java.util.List;

public class LMStudioResponse {

    private String id;
    private List<Choice> choices;

    // Renamed from getCompletionText() to getAnswer() to align with usage in service
    public String getAnswer() {
        if (choices != null && !choices.isEmpty()) {
            Message message = choices.get(0).getMessage();
            return message != null ? message.getContent() : "";
        }
        return "";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<Choice> getChoices() {
        return choices;
    }

    public void setChoices(List<Choice> choices) {
        this.choices = choices;
    }

    public static class Choice {
        private Message message;

        public Message getMessage() {
            return message;
        }

        public void setMessage(Message message) {
            this.message = message;
        }
    }

    public static class Message {
        private String content;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}
