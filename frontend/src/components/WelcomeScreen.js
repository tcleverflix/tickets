import React from 'react';

const WelcomeScreen = ({ onCreateTicket }) => {
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    position: 'relative',
    overflow: 'hidden'
  };

  const backgroundPatternStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)`,
    pointerEvents: 'none'
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '24px',
    padding: '60px 50px',
    maxWidth: '700px',
    width: '100%',
    boxShadow: '0 30px 90px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
    position: 'relative',
    backdropFilter: 'blur(10px)',
    animation: 'fadeIn 0.8s ease-out'
  };

  const logoContainerStyle = {
    marginBottom: '32px',
    animation: 'float 3s ease-in-out infinite'
  };

  const logoStyle = {
    fontSize: '72px',
    marginBottom: '16px',
    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))'
  };

  const brandNameStyle = {
    fontSize: '48px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px',
    letterSpacing: '-1px'
  };

  const taglineStyle = {
    fontSize: '18px',
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: '40px',
    letterSpacing: '0.5px'
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '16px',
    lineHeight: '1.3'
  };

  const descriptionStyle = {
    fontSize: '18px',
    color: '#4b5563',
    lineHeight: '1.7',
    marginBottom: '40px',
    maxWidth: '600px',
    margin: '0 auto 40px'
  };

  const featuresStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '24px',
    marginBottom: '48px'
  };

  const featureItemStyle = {
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    cursor: 'default',
    border: '1px solid transparent'
  };

  const featureIconStyle = {
    fontSize: '36px',
    marginBottom: '12px',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
  };

  const featureTitleStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px'
  };

  const featureDescStyle = {
    fontSize: '12px',
    color: '#6b7280'
  };

  const buttonStyle = {
    padding: '18px 48px',
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
    position: 'relative',
    overflow: 'hidden'
  };

  const footerStyle = {
    marginTop: '40px',
    paddingTop: '32px',
    borderTop: '1px solid #e5e7eb',
    color: '#9ca3af',
    fontSize: '14px'
  };

  // Animaciones CSS
  const styleTag = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
    }

    .btn-primary:active {
      transform: translateY(0px);
    }

    .feature-item:hover {
      background-color: white;
      border-color: #e5e7eb;
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }
  `;

  return (
    <>
      <style>{styleTag}</style>
      <div style={containerStyle}>
        <div style={backgroundPatternStyle}></div>

        <div style={cardStyle}>
          <div style={logoContainerStyle}>
            <div style={logoStyle}>🎫</div>
            <h1 style={brandNameStyle}>Tcleverflix</h1>
            <p style={taglineStyle}>Sistema de Soporte Informático</p>
          </div>

          <h2 style={titleStyle}>
            Siempre a su Disposición
          </h2>

          <p style={descriptionStyle}>
            Bienvenido a nuestro sistema de soporte premium. Estamos aquí para ayudarle con cualquier
            inconveniente o consulta que pueda tener. Nuestro equipo de expertos está listo para
            brindarle la mejor atención.
          </p>

          <div style={featuresStyle}>
            <div className="feature-item" style={featureItemStyle}>
              <div style={featureIconStyle}>⚡</div>
              <div style={featureTitleStyle}>Respuesta Rápida</div>
              <div style={featureDescStyle}>Atención en 24h</div>
            </div>

            <div className="feature-item" style={featureItemStyle}>
              <div style={featureIconStyle}>🛡️</div>
              <div style={featureTitleStyle}>Soporte Premium</div>
              <div style={featureDescStyle}>Equipo Experto</div>
            </div>

            <div className="feature-item" style={featureItemStyle}>
              <div style={featureIconStyle}>📊</div>
              <div style={featureTitleStyle}>Seguimiento</div>
              <div style={featureDescStyle}>En Tiempo Real</div>
            </div>

            <div className="feature-item" style={featureItemStyle}>
              <div style={featureIconStyle}>💬</div>
              <div style={featureTitleStyle}>Comunicación</div>
              <div style={featureDescStyle}>Directa y Clara</div>
            </div>
          </div>

          <button
            className="btn-primary"
            style={buttonStyle}
            onClick={onCreateTicket}
          >
            ✨ Generar Ticket de Atención
          </button>

          <div style={footerStyle}>
            <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#6b7280' }}>
              ¿Necesita ayuda?
            </p>
            <p style={{ margin: 0 }}>
              Cree su ticket y nuestro equipo le contactará a la brevedad
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeScreen;
