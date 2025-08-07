import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Қате'); // ❌ Ошибка
        return;
      }

      localStorage.setItem('user', JSON.stringify({
        token: data.token,
        ...data.user,
      }));

      localStorage.setItem('face_email', email);

      toast.success(data.message || 'Сәтті кірдіңіз ✅'); // ✅ Успех
      navigate('/profile');
    } catch (err) {
      console.error(err);
      toast.error('Сервер қатесі');
    }
  };

  const handleFaceID = () => {
    if (!email) {
      toast.error('Алдымен email енгізіңіз');
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
        <p className="switch-link">
          Аккаунтыңыз жоқ па? <Link to="/register">Тіркелу</Link>
        </p>
      </form>
    </div>
  );
}
