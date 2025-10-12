import React, { useState } from 'react';
import authService from '../services/auth';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await authService.login(username, password);

    if (result.success) {
      onLoginSuccess(result.user);
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  };

  const cardStyle = {
    backgroundColor: 'var(--white)',
    borderRadius: '16px',
    padding: '48px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    maxWidth: '420px',
    width: '100%'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '32px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    marginTop: '8px'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-primary)'
  };

  const inputStyle = {
    padding: '12px 16px',
    border: '2px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontSize: '16px',
    transition: 'border-color 0.2s',
    outline: 'none'
  };

  const buttonStyle = {
    padding: '14px',
    backgroundColor: 'var(--primary)',
    color: 'var(--white)',
    border: 'none',
    borderRadius: 'var(--radius)',
    fontSize: '16px',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '8px',
    opacity: loading ? 0.7 : 1
  };

  const errorStyle = {
    padding: '12px 16px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: 'var(--radius)',
    fontSize: '14px',
    border: '1px solid #fcc'
  };

  const iconStyle = {
    fontSize: '48px',
    marginBottom: '16px'
  };

  const footerStyle = {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--text-secondary)'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={iconStyle}>🎫</div>
          <h1 style={titleStyle}>TickKK</h1>
          <p style={subtitleStyle}>Panel de Administración</p>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="username" style={labelStyle}>
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              placeholder="Ingresa tu usuario"
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="password" style={labelStyle}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="Ingresa tu contraseña"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#2563eb')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--primary)')}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={footerStyle}>
          <p>Acceso exclusivo para personal autorizado</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
