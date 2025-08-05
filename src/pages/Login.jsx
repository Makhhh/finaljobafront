import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Қате');
        return;
      }

      // Сохраняем токен + юзера вместе
      localStorage.setItem('user', JSON.stringify({
        token: data.token,
        ...data.user,
      }));

      localStorage.setItem('face_email', email);
      navigate('/profile');
    } catch (err) {
      console.error(err);
      setError('Сервер қатесі');
    }
  };

  const handleFaceID = () => {
    if (!email) {
      setError('Алдымен email енгізіңіз');
    } else {
      localStorage.setItem('face_email', email);
      navigate('/face-login');
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Кіру</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Құпиясөз"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Кіру</button>
        <button type="button" className="faceid-button" onClick={handleFaceID}>
          👁‍🗨 Face ID қолдану
        </button>
        {error && <p className="error">{error}</p>}
        <p className="switch-link">
          Аккаунтыңыз жоқ па? <Link to="/register">Тіркелу</Link>
        </p>
      </form>
    </div>
  );
}
