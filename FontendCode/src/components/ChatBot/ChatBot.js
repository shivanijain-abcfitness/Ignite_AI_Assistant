import React, { useState, useEffect, useRef } from "react";
import {  FaUserCircle } from "react-icons/fa";
import { RiRobot3Fill } from "react-icons/ri";
import ReactMarkdown from "react-markdown";
import "./ChatBot.css";

export default function ChatBot({ onClose = () => {} }) {
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hello 👋 I'm Ignite AI Assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // 🔽 Auto scroll effect
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/chat/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Session-Id": "user-1234-session",
                },
                body: JSON.stringify({ query: userMessage }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch response");
            }

            const data = await response.text();
            const assistantResponse =
                data || "Sorry, I could not process your query.";

            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: assistantResponse },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "⚠️ Error: Unable to reach server." },
            ]);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            {/* Header */}
            <div className="chatbot-header">
                <div className="chatbot-header-left">
                    <img src="/abcLogo.jpg" alt="Bot Logo" className="bot-icon" style={{ width: 32, height: 32 }} />
                    <span>Ignite AI Assistant</span>
                </div>
                <button className="close-btn" onClick={onClose}>✕</button>
            </div>

            {/* Messages */}
            <div className="chatbot-body">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
                    >
                        {msg.sender === "bot" && <RiRobot3Fill className="avatar bot-avatar" />}
                        <div className="message-bubble">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                        {msg.sender === "user" && (
                            <FaUserCircle className="avatar user-avatar" />
                        )}
                    </div>
                ))}

                {loading && (
                    <div className="chat-message bot">
                        <RiRobot3Fill className="avatar bot-avatar" />
                        <div className="message-bubble">...</div>
                    </div>
                )}

                {/* 🔽 Invisible marker for auto-scroll */}
                <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <div className="chatbot-footer">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={loading}
                />
                <button onClick={handleSend} disabled={loading}>
                    <img
                        src="/abcignite_LOGO.svg"
                        alt="Send"
                        style={{ width: "24px", height: "24px" }}
                    />
                </button>
            </div>
        </div>
    );
}
