import React, { useState, useEffect } from 'react';
import Header from './Header';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';
import NewTicketFormPremium from './NewTicketFormPremium';
import WelcomeScreen from './WelcomeScreen';
import Login from './Login';
import AdminPanel from './AdminPanel';
import authService from '../services/auth';
import { ticketsApi } from '../services/api';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [viewMode, setViewMode] = useState('public'); // 'public' or 'admin'

  // Public view states
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome', 'list', 'detail', 'new'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    authService.init();

    if (authService.isAuthenticated()) {
      const result = await authService.verifyToken();
      if (result.success) {
        setCurrentUser(result.user);
        setViewMode('admin');
      }
    }

    setIsAuthChecking(false);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setViewMode('admin');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setViewMode('public');
  };

  const handleToggleView = () => {
    if (viewMode === 'public' && !currentUser) {
      // Show login
      setViewMode('login');
    } else if (viewMode === 'admin') {
      setViewMode('public');
    } else {
      setViewMode('admin');
    }
  };

  // Public view functions
  useEffect(() => {
    if (viewMode === 'public') {
      loadTickets();
    }
  }, [viewMode]);

  const loadTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ticketsApi.getTickets();
      setTickets(response.data);
    } catch (error) {
      console.error('Error loading tickets:', error);
      setError('Error al cargar los tickets. Por favor recarga la página.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewTicket = () => {
    setCurrentView('new');
    setSelectedTicket(null);
  };

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedTicket(null);
  };

  const handleBackToWelcome = () => {
    setCurrentView('welcome');
    setSelectedTicket(null);
  };

  const handleTicketCreated = (newTicket) => {
    setTickets(prev => [newTicket, ...prev]);
    setSelectedTicket(newTicket);
    setCurrentView('welcome'); // Volver a bienvenida después de crear ticket
    // Mostrar mensaje de éxito
    setTimeout(() => {
      alert('✅ ¡Ticket creado exitosamente!\n\nHemos enviado una confirmación a su correo electrónico.\n\nNuestro equipo le contactará pronto.');
    }, 300);
  };

  const handleTicketUpdate = (updatedTicket) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
    setSelectedTicket(updatedTicket);
  };

  // Styles
  const appStyle = {
    minHeight: '100vh',
    backgroundColor: 'var(--background)',
    display: 'flex',
    flexDirection: 'column'
  };

  const mainStyle = {
    flex: 1,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  };

  const contentStyle = {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: currentView === 'list' ? '1fr' : '1fr',
    gap: '24px',
    minHeight: 0
  };

  const errorStyle = {
    padding: '16px',
    backgroundColor: 'var(--error)',
    color: 'var(--white)',
    borderRadius: 'var(--radius)',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const toggleButtonStyle = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    padding: '12px 24px',
    backgroundColor: 'var(--primary)',
    color: 'var(--white)',
    border: 'none',
    borderRadius: '24px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  // Show loading while checking auth
  if (isAuthChecking) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--background)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎫</div>
          <div style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Cargando...</div>
        </div>
      </div>
    );
  }

  // Show Login
  if (viewMode === 'login') {
    return (
      <>
        <Login onLoginSuccess={handleLoginSuccess} />
        <button
          onClick={() => setViewMode('public')}
          style={toggleButtonStyle}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          👤 Volver a Vista Pública
        </button>
      </>
    );
  }

  // Show Admin Panel
  if (viewMode === 'admin' && currentUser) {
    return (
      <>
        <AdminPanel
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        <button
          onClick={handleToggleView}
          style={toggleButtonStyle}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          👥 Ver Vista Pública
        </button>
      </>
    );
  }

  // Show Public View
  const renderContent = () => {
    switch (currentView) {
      case 'welcome':
        return (
          <WelcomeScreen onCreateTicket={handleNewTicket} />
        );

      case 'list':
        return (
          <TicketList
            tickets={tickets}
            onTicketSelect={handleTicketSelect}
            selectedTicket={selectedTicket}
            loading={loading}
            onRefresh={loadTickets}
          />
        );

      case 'detail':
        return selectedTicket ? (
          <TicketDetail
            ticket={selectedTicket}
            onBack={handleBackToList}
            onTicketUpdate={handleTicketUpdate}
          />
        ) : (
          <div>Ticket no encontrado</div>
        );

      case 'new':
        return (
          <NewTicketFormPremium
            onBack={handleBackToWelcome}
            onTicketCreated={handleTicketCreated}
          />
        );

      default:
        return <WelcomeScreen onCreateTicket={handleNewTicket} />;
    }
  };

  // Para vistas welcome y new no mostrar el layout estándar
  if (currentView === 'welcome' || currentView === 'new') {
    return (
      <>
        {renderContent()}
        {/* Toggle Button */}
        <button
          onClick={handleToggleView}
          style={toggleButtonStyle}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          🔐 Acceso para Soporte
        </button>
      </>
    );
  }

  return (
    <>
      <div style={appStyle}>
        <Header
          onNewTicket={handleNewTicket}
          currentView={currentView}
        />

        <main style={mainStyle}>
          <div style={contentStyle}>
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Toggle Button */}
      <button
        onClick={handleToggleView}
        style={toggleButtonStyle}
        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
      >
        🔐 Acceso para Soporte
      </button>
    </>
  );
};

export default App;
