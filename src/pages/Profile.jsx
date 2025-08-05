import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [loginHistory, setLoginHistory] = useState([]);

  useEffect(() => {
    if (user && !user.hasOwnProperty("showFace")) {
      const updatedUser = { ...user, showFace: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  }, []);

  useEffect(() => {
    const fetchLogins = async () => {
      try {
        const res = await axios.get("/api/users/logins", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        console.log("loginHistory:", res.data); // Для отладки
        if (Array.isArray(res.data)) {
          setLoginHistory(res.data);
        } else {
          setLoginHistory([]);
        }
      } catch (err) {
        console.error("❌ Login history fetch error:", err.response?.data || err.message);
        setLoginHistory([]);
      }
    };

    if (user.token) {
      fetchLogins();
    }
  }, [user.token]);

  const goToSettings = () => {
    navigate("/settings");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="avatar">
          <FaUserCircle size={80} />
          <h2 className="welcome">Қош келдіңіз, {user.username}!</h2>
        </div>

        <div className="info-card">
          <h3 className="label">Email</h3>
          <p className="value">{user.email}</p>
        </div>

        <div className="info-card">
          <h3 className="label">Face ID күйі</h3>
          <div className="status-line">
            <span className={`status-dot ${user.face_image ? "green" : "red"}`}></span>
            <span className="status-text">
              {user.face_image ? "Қосылған" : "Қосылмаған"}
            </span>
          </div>
        </div>

        {Array.isArray(loginHistory) && loginHistory.length > 0 && (
          <div className="info-card">
            <h3 className="label">Соңғы кірулер</h3>
            <ul className="login-history">
              {loginHistory.map((log, idx) => (
                <li key={idx}>
                  <strong>{log.method}</strong> —{" "}
                  {new Date(log.timestamp).toLocaleString()}<br />
                  <small>{log.user_agent}</small>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="info-card system-info system-info-blue">
          <h3 className="label">Жүйе жайлы:</h3>
          <p className="description">
            Бұл аккаунт Face ID арқылы жылдам кіруге мүмкіндік береді.
            Қосымша қауіпсіздік үшін бет-әлпетіңізді тіркеңіз.
          </p>
        </div>

        <button className="settings-button" onClick={goToSettings}>
          ⚙️ Баптаулар
        </button>
      </div>
    </div>
  );
}

export default Profile;
