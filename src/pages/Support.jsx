import React, { useEffect, useState } from "react";
import "./Support.css";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Support() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(() => {
    const saved = localStorage.getItem("support_attempts");
    return saved ? parseInt(saved) : 0;
  });
  const [locked, setLocked] = useState(() => {
    const until = localStorage.getItem("support_locked_until");
    return until && new Date(until) > new Date();
  });
  const [showModal, setShowModal] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    if (attempts >= 5) {
      const lockUntil = new Date();
      lockUntil.setHours(23, 59, 59, 999);
      localStorage.setItem("support_locked_until", lockUntil);
      setLocked(true);
    }
    localStorage.setItem("support_attempts", attempts);
  }, [attempts]);

  const sendMessage = async () => {
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttempts((prev) => prev + 1);

    try {
      const res = await axios.post(
        "https://finaljoba.onrender.com/api/support",
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || locked) return;
    if (attempts === 4) {
      setShowModal(true);
    } else {
      sendMessage();
    }
  };

  const confirmFinal = () => {
    setShowModal(false);
    sendMessage();
  };

  const cancelFinal = () => {
    setShowModal(false);
  };

  return (
    <div className="support-wrapper">
      <div className="support-box">
        <h2 className="support-title">💬 Қолдау чаты</h2>
        <p className="support-attempts">
          Қалған сұрақтар: {Math.max(0, 5 - attempts)}
        </p>
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
            disabled={locked}
          />
          <button type="submit" disabled={locked}>Жіберу</button>
        </form>
        {locked && (
          <p className="support-locked">
            Күндік лимит аяқталды. Ертең қайта жазыңыз.
          </p>
        )}
      </div>

      <Link className="Kaitu" to="/profile">Қайту</Link>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Бұл сіздің соңғы сұрағыңыз. Жібересіз бе?</p>
            <div className="modal-buttons">
              <button onClick={confirmFinal}>Иә, жіберу</button>
              <button onClick={cancelFinal}>Басқа сұрақ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
