import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FaceLogin.css';

export default function FaceLogin() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('Камера қатесі:', err);
        setMessage('Камера табылмады');
      });
  }, []);

  const handleScan = async () => {
  const email = localStorage.getItem('face_email');
  if (!email) {
    setMessage('Email табылмады. Алдымен логин парақшасынан кіріңіз.');
    return;
  }

  setIsScanning(true);
  setMessage('');

  const context = canvasRef.current.getContext('2d');
  context.drawImage(videoRef.current, 0, 0, 320, 240);
  const imageData = canvasRef.current.toDataURL('image/png');

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/compare-face`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, imageData })
    });

    const data = await res.json();

    if (res.ok && data.message.includes('✅')) {
      localStorage.setItem('user_email', email); // Немесе басқа қажет мәлімет
      navigate('/profile');
    } else {
      setMessage(data.message || '❌ Face ID сәйкес келмеді');
    }

  } catch (err) {
    console.error(err);
    setMessage('❌ Қате пайда болды');
  }

  setIsScanning(false);
};


  return (
    <div className="face-login-container">
      <div className="face-login-card">
        <h1>Face ID арқылы кіру</h1>
        <div className="camera-box">
          <video ref={videoRef} autoPlay className="video-preview" />
          <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />
        </div>
        <button className="scan-button" onClick={handleScan} disabled={isScanning}>
          {isScanning ? 'Сканерлеу...' : 'Face ID тексеру'}
        </button>
        {message && <div className="result-text">{message}</div>}
      </div>
    </div>
  );
}
