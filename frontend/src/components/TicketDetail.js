import React, { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';
import { ticketsApi } from '../services/api';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  MessageCircle,
  Send,
  Edit3
} from 'lucide-react';

const TicketDetail = ({ ticket, onBack, onTicketUpdate }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (ticket?.comments) {
      setComments(ticket.comments);
    }
  }, [ticket]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const response = await ticketsApi.updateTicketStatus(ticket.id, newStatus);
      onTicketUpdate(response.data);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar el estado del ticket');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim() || !authorEmail.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const commentData = {
        author_name: authorName,
        author_email: authorEmail,
        comment_text: newComment,
        is_internal: false
      };

      const response = await ticketsApi.addComment(ticket.id, commentData);
      setComments([...comments, response.data]);
      setNewComment('');

      // Update the ticket in parent component
      const updatedTicket = await ticketsApi.getTicket(ticket.id);
      onTicketUpdate(updatedTicket.data);
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error al añadir el comentario');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'critica':
        return { color: 'var(--error)', text: 'Crítica', icon: AlertCircle };
      case 'alta':
        return { color: 'var(--warning)', text: 'Alta', icon: AlertCircle };
      case 'media':
        return { color: 'var(--primary)', text: 'Media', icon: Tag };
      case 'baja':
        return { color: 'var(--secondary)', text: 'Baja', icon: Tag };
      default:
        return { color: 'var(--secondary)', text: priority, icon: Tag };
    }
  };

  const priorityConfig = getPriorityConfig(ticket.priority);
  const PriorityIcon = priorityConfig.icon;

  const containerStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--white)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow)',
    overflow: 'hidden'
  };

  const headerStyle = {
    padding: '24px',
    borderBottom: '1px solid var(--border-light)',
    backgroundColor: 'var(--white)'
  };

  const backButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-light)',
    cursor: 'pointer',
    marginBottom: '16px',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: 'var(--text)',
    marginBottom: '16px',
    lineHeight: '1.3'
  };

  const metaGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px'
  };

  const metaItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: 'var(--text-light)'
  };

  const actionsStyle = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  };

  const contentStyle = {
    flex: 1,
    overflow: 'auto',
    padding: '24px'
  };

  const sectionStyle = {
    marginBottom: '32px'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--text)',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const descriptionStyle = {
    fontSize: '15px',
    lineHeight: '1.6',
    color: 'var(--text)',
    backgroundColor: 'var(--background-secondary)',
    padding: '16px',
    borderRadius: 'var(--radius)',
    whiteSpace: 'pre-wrap'
  };

  const commentStyle = {
    padding: '16px',
    backgroundColor: 'var(--background-secondary)',
    borderRadius: 'var(--radius)',
    marginBottom: '12px',
    border: '1px solid var(--border-light)'
  };

  const commentHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '13px',
    color: 'var(--text-light)'
  };

  const commentAuthorStyle = {
    fontWeight: '500',
    color: 'var(--text)'
  };

  const commentTextStyle = {
    fontSize: '14px',
    lineHeight: '1.5',
    color: 'var(--text)',
    whiteSpace: 'pre-wrap'
  };

  const formStyle = {
    display: 'grid',
    gap: '16px',
    padding: '16px',
    backgroundColor: 'var(--background-secondary)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border-light)'
  };

  const formRowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={onBack}>
          <ArrowLeft size={16} />
          Volver a la lista
        </button>

        <div style={titleStyle}>
          {ticket.subject}
        </div>

        <div style={metaGridStyle}>
          <div style={metaItemStyle}>
            <User size={16} />
            <strong>{ticket.client_name}</strong>
          </div>
          <div style={metaItemStyle}>
            <Mail size={16} />
            {ticket.client_email}
          </div>
          <div style={metaItemStyle}>
            <Phone size={16} />
            {ticket.client_phone || 'Sin celular'}
          </div>
          <div style={metaItemStyle}>
            <Calendar size={16} />
            {formatDate(ticket.created_at)}
          </div>
          <div style={metaItemStyle}>
            <Clock size={16} />
            Actualizado: {formatDate(ticket.updated_at)}
          </div>
          <div style={metaItemStyle}>
            <PriorityIcon size={16} style={{ color: priorityConfig.color }} />
            <span style={{ color: priorityConfig.color, fontWeight: '500' }}>
              {priorityConfig.text}
            </span>
          </div>
          <div style={metaItemStyle}>
            <Tag size={16} />
            {ticket.category || 'Sin categoría'}
          </div>
          <div style={metaItemStyle}>
            <Building size={16} />
            {ticket.department || 'Sin departamento'}
          </div>
        </div>

        <div style={actionsStyle}>
          <StatusBadge status={ticket.status} />

          {ticket.status !== 'en_proceso' && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleStatusChange('en_proceso')}
              disabled={updating}
            >
              {updating ? 'Actualizando...' : 'Marcar En Proceso'}
            </button>
          )}

          {ticket.status !== 'cerrado' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleStatusChange('cerrado')}
              disabled={updating}
            >
              {updating ? 'Actualizando...' : 'Cerrar Ticket'}
            </button>
          )}

          {ticket.status === 'cerrado' && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleStatusChange('abierto')}
              disabled={updating}
            >
              {updating ? 'Actualizando...' : 'Reabrir Ticket'}
            </button>
          )}
        </div>
      </div>

      <div style={contentStyle}>
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <Edit3 size={18} />
            Descripción
          </div>
          <div style={descriptionStyle}>
            {ticket.description}
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <MessageCircle size={18} />
            Comentarios ({comments.length})
          </div>

          {comments.length === 0 ? (
            <div style={{ color: 'var(--text-light)', fontStyle: 'italic', padding: '16px 0' }}>
              No hay comentarios aún.
            </div>
          ) : (
            <div>
              {comments.map((comment) => (
                <div key={comment.id} style={commentStyle}>
                  <div style={commentHeaderStyle}>
                    <span style={commentAuthorStyle}>{comment.author_name}</span>
                    <span>{formatDate(comment.created_at)}</span>
                  </div>
                  <div style={commentTextStyle}>
                    {comment.comment_text}
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddComment} style={formStyle}>
            <div style={formRowStyle}>
              <input
                type="text"
                placeholder="Tu nombre"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="input"
                required
              />
              <input
                type="email"
                placeholder="Tu email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                className="input"
                required
              />
            </div>
            <textarea
              placeholder="Escribe tu comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="input textarea"
              required
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ justifySelf: 'flex-start' }}
            >
              <Send size={16} />
              {loading ? 'Enviando...' : 'Añadir Comentario'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;