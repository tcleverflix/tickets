import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'abierto':
        return {
          color: 'var(--primary)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          text: 'Abierto'
        };
      case 'en_proceso':
        return {
          color: 'var(--warning)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          text: 'En Proceso'
        };
      case 'cerrado':
        return {
          color: 'var(--success)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          text: 'Cerrado'
        };
      default:
        return {
          color: 'var(--secondary)',
          backgroundColor: 'rgba(107, 114, 128, 0.1)',
          text: status
        };
    }
  };

  const config = getStatusConfig(status);

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    color: config.color,
    backgroundColor: config.backgroundColor,
    border: `1px solid ${config.color}20`,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  return (
    <span style={badgeStyle}>
      {config.text}
    </span>
  );
};

export default StatusBadge;