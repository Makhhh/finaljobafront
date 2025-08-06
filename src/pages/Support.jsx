import React, { useState } from "react";
import "./Support.css";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Support() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post(
        "/api/support",
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const botMessage = {
        sender: "bot",
        text: res.data.response || "Қате болды...",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMsg = {
        sender: "bot",
        text: "Сервер қатесі немесе байланыс жоқ.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setInput("");
  };

  return (
    <div className="support-wrapper">
      <div className="support-box">
        <h2 className="support-title">💬 Қолдау чаты</h2>
        <div className="support-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`support-message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="support-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Сұрағыңызды жазыңыз..."
          />
          <button type="submit">Жіберу</button>
        </form>
      </div>
      <Link to={'/profile'}>
           Қайту
     </Link>
    </div>
  );
}
