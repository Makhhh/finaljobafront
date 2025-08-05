import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import faceIDImage from "../assets/boyFaceID.png"; 

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <div className="home-left">
        <img src={faceIDImage} alt="Face ID Scan Illustration" className="home-image" />
      </div>

      <div className="home-right">
        <div className="home-content">
          <h1>Face ID арқылы кіруге қош келдіңіз!</h1>
          <p>Бұл сайт заманауи Face ID технологиясын пайдалана отырып, қауіпсіз әрі жылдам кіруді ұсынады.
              Өзіңізге ыңғайлы тәсілді таңдап, жүйеге кіріңіз немесе жаңа аккаунт тіркеңіз.</p>
          <div className="home-buttons">
            <button onClick={() => navigate("/login")}>Кіру</button>
            <button onClick={() => navigate("/register")}>Тіркелу</button>
          </div>
        </div>
      </div>
    </div>
  );
}
