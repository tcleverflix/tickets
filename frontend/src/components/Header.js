import React from 'react';
import { Plus, Ticket } from 'lucide-react';

const Header = ({ onNewTicket, currentView }) => {
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 32px',
    backgroundColor: 'var(--white)',
    borderBottom: '1px solid var(--border)',
    boxShadow: 'var(--shadow-sm)'
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text)'
  };

  const logoIconStyle = {
    color: 'var(--primary)',
    width: '32px',
    height: '32px'
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: 'var(--text-light)',
    fontWeight: '400',
    marginLeft: '44px',
    marginTop: '-4px'
  };

  return (
    <header style={headerStyle} className="animate-fade-in">
      <div>
        <div style={logoStyle}>
          <Ticket style={logoIconStyle} />
          TickKK
        </div>
        <div style={subtitleStyle}>
          Sistema de Tickets Premium
        </div>
      </div>

      {currentView !== 'new' && (
        <button
          className="btn btn-primary"
          onClick={onNewTicket}
        >
          <Plus size={16} />
          Nuevo Ticket
        </button>
      )}
    </header>
  );
};

export default Header;