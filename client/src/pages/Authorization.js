import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './Authorization.css';

function Authorization() {
    const location = useLocation();
    const initialEmail = location.state?.prefilledEmail || '';

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!email || !password) {
            return setError('Будь ласка, заповніть усі поля');
        }

        if (isLogin) {
            try {
                const response = await axios.post('/api/auth/login', { email, password });
                setMessage(response.data.message);

                localStorage.setItem('token', response.data.token);

                setEmail('');
                setPassword('');

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userEmail', response.data.user.email);
                localStorage.setItem('userRole', response.data.user.role);

                window.location.href = '/profile';
            } catch (err) {
                setError(err.response?.data?.message || "Помилка входу");
            }
        } else {
            try {
                const response = await axios.post('/api/auth/register', { email, password });
                setMessage(response.data.message);
                setEmail('');
                setPassword('');
            } catch (err) {
                setError(err.response?.data?.message || 'Помилка реєстрації');
            }
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">{isLogin ? 'Вхід в акаунт' : 'Реєстрація'}</h2>

            {error && <div className="auth-message-error">{error}</div>}
            {message && <div className="auth-message-success">{message}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    type="email"
                    placeholder="Електронна пошта"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                />

                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                />

                <label className="auth-checkbox-label">
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    Показати пароль
                </label>

                <button type="submit" className="auth-submit-btn">
                    {isLogin ? 'Увійти' : 'Зареєструватися'}
                </button>
            </form>

            <div className="auth-switch-container">
                <button
                    type="button"
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setMessage('');
                        setError('');
                    }}
                    className="auth-switch-btn"
                >
                    {isLogin ? 'Немає акаунту? Зареєструватися' : 'Вже є акаунт? Увійти'}
                </button>
            </div>
        </div>
    );
}

export default Authorization;