import React, { useState, useEffect } from "react";
import "./Settings.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const token = storedUser.token;

  const [name, setName] = useState(storedUser.username || "");
  const [faceImage, setFaceImage] = useState(storedUser.face_image || null);
  const [showFace, setShowFace] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);


  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.setItem("user", JSON.stringify({ ...res.data, token }));
      setName(res.data.username);
      setFaceImage(res.data.face_image || null);
    } catch (err) {
      console.error("Қате:", err);
      setError("Пайдаланушы мәліметтері алынбады");
    }
  };

  const updateName = async () => {
    setError("");
    setSuccess("");
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/me`,
        { username: name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.setItem("user", JSON.stringify({ ...res.data, token }));
      setSuccess("Атыңыз сәтті жаңартылды ✅");
    } catch (err) {
      console.error("Қате:", err);
      setError("Атыңыз жаңартылмады");
    }
  };

  const deleteFace = async () => {
    setError("");
    setSuccess("");
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/users/face`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedUser = { ...storedUser, face_image: null };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setFaceImage(null);
      setShowFace(false);
      setSuccess("Face ID жойылды ✅");
    } catch (err) {
      console.error("Қате:", err);
      setError("Face ID жойылмады");
    }
  };

  const goToAddFace = () => {
    localStorage.setItem("face_email", storedUser.email);
    navigate("/face");
  };

  const handleLogout = () => {
  localStorage.clear(); 
  navigate('/login');  
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2>Профиль баптаулары</h2>

        <div className="info-card">
          <div className="label">Атыңыз</div>
          <input
            className="input-field"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="info-card">
          <div className="label">Face ID күйі</div>
          {faceImage ? (
            <>
              <div className="status-line">
                <span className="status-dot green" />
                <span className="status-text">Тіркелген</span>
              </div>
              {showFace && faceImage.startsWith("data:image") && (
                <img
                  src={faceImage}
                  alt="Face"
                  className="face-preview"
                />
              )}
              <div className="face-buttons">
                <button
                  className="toggle-face"
                  onClick={() => setShowFace(!showFace)}
                >
                  {showFace ? "Скрыть фото" : "Посмотреть фото"}
                </button>
                <button className="delete-face" onClick={deleteFace}>
                  Жою
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="status-line">
                <span className="status-dot red" />
                <span className="status-text">Тіркелмеген</span>
              </div>
              <button className="add-face" onClick={goToAddFace}>
                Face ID қосу
              </button>
            </>
          )}
        </div>

        <div className="button-row">
          <button className="save-button" onClick={updateName}>
            Сақтау
          </button>
          <button className="back-button" onClick={() => navigate("/profile")}>
            Қайту
          </button>
        </div>
        <button className="logout-button" onClick={() => setShowConfirmLogout(true)}>
         Шығу
        </button>
        {showConfirmLogout && (
        <div className="modal-overlay">
           <div className="modal">
              <p>Шығу үшін сенімдісіз бе?</p>
          <div className="modal-buttons">
              <button onClick={handleLogout} className="confirm-yes">Иә</button>
              <button onClick={() => setShowConfirmLogout(false)} className="confirm-no">Жоқ</button>
        </div>
      </div>
  </div>
)}




        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
