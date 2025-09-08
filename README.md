# 🧠 Ignite AI
- Ignite AI is a Spring Boot–based chatbot that:
answers questions in real time using RAG (document ingestion → embeddings → semantic search),
securely automates membership actions (freeze/cancel) via existing eAPIs,
reduces support load while improving member satisfaction.

## 🚀 Features

- 🖼️ Chat with Ignite AI , get answers to your questions
-    Freeze your membership at any time via Ignite AI instantly
-    Cancel your membership at any time via Ignite AI instantly
- 📄 Upload documents (PDF, TXT, etc.)
- 🧩 Extract and chunk document text
- 🧠 Generate embeddings via LM Studio
- 💾 Store embeddings in Qdrant (vector database)
- 🔍 Semantic search on query
- 💬 Answer questions using retrieved chunks via LM Studio

---

## 🛠️ Tech Stack

| Layer        | Technology                       |
|--------------|----------------------------------|
| Backend      | Spring Boot (WebFlux)            |
| Vector DB    | Qdrant (via Docker)              |
| Embeddings   | LM Studio `/v1/embeddings`       |
| LLM Chat     | LM Studio `/v1/chat/completions` |
| File Parsing | Apache Tika                      |
| Java Version | 17+                              |
| Build Tool   | Maven                            |

---
## ⚙️ Setup Instructions

### 1. 🧬 Prerequisites

- Java 17+
- Maven
- Docker
- [LM Studio](https://lmstudio.ai/) running locally with:
    - `/v1/embeddings` support
    - `/v1/chat/completions` support


### 2. 🐳 Qdrant Setup with Docker

```bash
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant

# Build the project
mvn clean install

# Run the app
mvn spring-boot:run
  ```` 

### 3. 🖥️ Frontend Setup

```bash
# From the frontend directory (e.g., ./frontend)
npm install

# Run Project
npm start



