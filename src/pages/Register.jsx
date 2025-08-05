import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Қате тіркеуде');
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      alert("✅ Тіркеу сәтті өтті!");
      navigate('/Login');
    } catch (err) {
      console.error(err);
      setError('Сервер қатесі');
    }
  };

  return (
    <div className="register-wrapper">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Тіркелу</h1>
        <input
          type="text"
          name="username"
          placeholder="Атыныз"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Құпия сөз"
          onChange={handleChange}
          required
        />
        <button type="submit">Тіркелу</button>
        {error && <p className="error">{error}</p>}
        <p className="switch-link">
          Аккаунтыңыз бар ма? <Link to="/login">Кіру</Link>
        </p>
      </form>
    </div>
  );
}
