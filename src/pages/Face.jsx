import React, { useEffect, useRef, useState } from "react";
import "./Face.css";

export default function Face() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Ошибка при доступе к камере:", err);
      });
  }, []);

  const handleScan = async () => {
    setIsScanning(true);
    setScanResult(null);

    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 320, 240);
    const imageData = canvasRef.current.toDataURL("image/png");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload-face`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: storedUser.email,
          imageData,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedUser = { ...storedUser, face_image: imageData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setScanResult("✅ Фото успешно сохранено");
      } else {
        setScanResult(`❌ ${data.error || "Ошибка загрузки"}`);
      }
    } catch (err) {
      console.error(err);
      setScanResult("❌ Ошибка при отправке запроса");
    }

    setIsScanning(false);
  };

  return (
    <div className="face-page">
      <div className="face-box">
        <h1>Face ID тіркеу</h1>
        <div className="camera-box">
          <video ref={videoRef} autoPlay className="video-preview" />
          <canvas
            ref={canvasRef}
            width="320"
            height="240"
            style={{ display: "none" }}
          />
        </div>

        <button onClick={handleScan} disabled={isScanning}>
          {isScanning ? "Сканируется..." : "Сканировать лицо"}
        </button>

        {scanResult && <p className="result-text">{scanResult}</p>}
      </div>
    </div>
  );
}
