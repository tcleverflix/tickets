import React from 'react';
import StatusBadge from './StatusBadge';
import { Calendar, User, MessageCircle } from 'lucide-react';

const TicketListItem = ({ ticket, onClick, isSelected }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critica': return 'var(--error)';
      case 'alta': return 'var(--warning)';
      case 'media': return 'var(--primary)';
      case 'baja': return 'var(--secondary)';
      default: return 'var(--secondary)';
    }
  };

  const itemStyle = {
    padding: '20px',
    borderBottom: '1px solid var(--border-light)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isSelected ? 'var(--background-secondary)' : 'var(--white)',
    borderLeft: `4px solid ${getPriorityColor(ticket.priority)}`
  };

  const itemHoverStyle = {
    ...itemStyle,
    backgroundColor: isSelected ? 'var(--background-secondary)' : 'var(--background)',
    transform: 'translateX(2px)'
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text)',
    marginBottom: '4px',
    lineHeight: '1.4'
  };

  const idStyle = {
    fontSize: '12px',
    color: 'var(--text-light)',
    fontWeight: '500',
    backgroundColor: 'var(--background-secondary)',
    padding: '2px 8px',
    borderRadius: '4px'
  };

  const metaStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '13px',
    color: 'var(--text-light)',
    marginBottom: '8px'
  };

  const metaItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const descriptionStyle = {
    fontSize: '14px',
    color: 'var(--text-light)',
    lineHeight: '1.5',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px'
  };

  return (
    <div
      style={isHovered ? itemHoverStyle : itemStyle}
      onClick={() => onClick(ticket)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="animate-slide-in"
    >
      <div style={headerStyle}>
        <div style={titleStyle}>
          {ticket.subject}
        </div>
        <div style={idStyle}>
          #{ticket.id}
        </div>
      </div>

      <div style={metaStyle}>
        <div style={metaItemStyle}>
          <User size={14} />
          {ticket.client_name}
        </div>
        <div style={metaItemStyle}>
          <Calendar size={14} />
          {formatDate(ticket.created_at)}
        </div>
        {ticket.comments && ticket.comments.length > 0 && (
          <div style={metaItemStyle}>
            <MessageCircle size={14} />
            {ticket.comments.length} comentario{ticket.comments.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div style={descriptionStyle}>
        {ticket.description}
      </div>

      <div style={footerStyle}>
        <StatusBadge status={ticket.status} />
        {ticket.category && (
          <span style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--background-secondary)',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            {ticket.category}
          </span>
        )}
      </div>
    </div>
  );
};

export default TicketListItem;