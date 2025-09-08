package spring.ai.model.spring_ai_model.model;

import java.util.List;

public class EmbeddingResponse {

    private List<Data> data;

    public List<Data> getData() {
        return data;
    }

    public void setData(List<Data> data) {
        this.data = data;
    }

    /**
     * Extracts the first embedding vector as a float[] from the response.
     */
    public float[] getEmbeddingVector() {
        if (data != null && !data.isEmpty()) {
            List<Double> embeddingDoubleList = data.get(0).getEmbedding();
            float[] embeddingFloatArray = new float[embeddingDoubleList.size()];
            for (int i = 0; i < embeddingDoubleList.size(); i++) {
                embeddingFloatArray[i] = embeddingDoubleList.get(i).floatValue();
            }
            return embeddingFloatArray;
        }
        return new float[0];
    }

    public static class Data {
        private List<Double> embedding;
        private int index;

        public List<Double> getEmbedding() {
            return embedding;
        }

        public void setEmbedding(List<Double> embedding) {
            this.embedding = embedding;
        }

        public int getIndex() {
            return index;
        }

        public void setIndex(int index) {
            this.index = index;
        }
    }
}
