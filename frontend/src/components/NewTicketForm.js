import React, { useState } from 'react';
import { ticketsApi } from '../services/api';
import { ArrowLeft, Send, User, Mail, Type, FileText, Tag, AlertCircle, Phone, Building } from 'lucide-react';

const NewTicketForm = ({ onBack, onTicketCreated }) => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    subject: '',
    description: '',
    priority: 'media',
    category: '',
    department: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.client_name.trim()) {
      newErrors.client_name = 'El nombre es obligatorio';
    }

    if (!formData.client_email.trim()) {
      newErrors.client_email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.client_email)) {
      newErrors.client_email = 'El email no es válido';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'El asunto es obligatorio';
    } else if (formData.subject.length < 10) {
      newErrors.subject = 'El asunto debe tener al menos 10 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (formData.description.length < 20) {
      newErrors.description = 'La descripción debe tener al menos 20 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await ticketsApi.createTicket(formData);
      onTicketCreated(response.data);
      setFormData({
        client_name: '',
        client_email: '',
        client_phone: '',
        subject: '',
        description: '',
        priority: 'media',
        category: '',
        department: ''
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Error al crear el ticket. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

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
    marginBottom: '8px'
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: 'var(--text-light)'
  };

  const contentStyle = {
    flex: 1,
    overflow: 'auto',
    padding: '24px'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '600px'
  };

  const fieldGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text)'
  };

  const errorStyle = {
    fontSize: '12px',
    color: 'var(--error)',
    marginTop: '4px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  };

  const actionsStyle = {
    display: 'flex',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-light)'
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

  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={onBack}>
          <ArrowLeft size={16} />
          Volver a la lista
        </button>

        <div style={titleStyle}>
          Crear Nuevo Ticket
        </div>
        <div style={subtitleStyle}>
          Completa la información para crear un nuevo ticket de soporte
        </div>
      </div>

      <div style={contentStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={gridStyle}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                <User size={16} />
                Nombre del Cliente *
              </label>
              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                className="input"
                placeholder="Ingresa tu nombre completo"
                style={{
                  borderColor: errors.client_name ? 'var(--error)' : 'var(--border)'
                }}
              />
              {errors.client_name && (
                <div style={errorStyle}>{errors.client_name}</div>
              )}
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                <Mail size={16} />
                Email del Cliente *
              </label>
              <input
                type="email"
                name="client_email"
                value={formData.client_email}
                onChange={handleChange}
                className="input"
                placeholder="tu@email.com"
                style={{
                  borderColor: errors.client_email ? 'var(--error)' : 'var(--border)'
                }}
              />
              {errors.client_email && (
                <div style={errorStyle}>{errors.client_email}</div>
              )}
            </div>
            
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                <Phone size={16} />
                Número de Celular
              </label>
              <input
                type="tel"
                name="client_phone"
                value={formData.client_phone}
                onChange={handleChange}
                className="input"
                placeholder="Ej: +51 999 999 999"
              />
              {errors.client_phone && (
                <div style={errorStyle}>{errors.client_phone}</div>
              )}
            </div>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              <Type size={16} />
              Asunto del Ticket *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="input"
              placeholder="Describe brevemente el problema o solicitud"
              style={{
                borderColor: errors.subject ? 'var(--error)' : 'var(--border)'
              }}
            />
            {errors.subject && (
              <div style={errorStyle}>{errors.subject}</div>
            )}
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              <FileText size={16} />
              Descripción Detallada *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input textarea"
              placeholder="Proporciona una descripción detallada del problema, incluyendo pasos para reproducirlo, mensajes de error, y cualquier información relevante..."
              rows={6}
              style={{
                borderColor: errors.description ? 'var(--error)' : 'var(--border)'
              }}
            />
            {errors.description && (
              <div style={errorStyle}>{errors.description}</div>
            )}
          </div>

          <div style={gridStyle}>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                <AlertCircle size={16} style={{ color: getPriorityColor(formData.priority) }} />
                Prioridad
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="input"
                style={{ color: getPriorityColor(formData.priority) }}
              >
                <option value="baja">Baja - No urgente</option>
                <option value="media">Media - Normal</option>
                <option value="alta">Alta - Importante</option>
                <option value="critica">Crítica - Urgente</option>
              </select>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                <Tag size={16} />
                Categoría (Opcional)
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input"
              >
                <option value="">Seleccionar categoría</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Red">Red/Conectividad</option>
                <option value="Email">Email</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Cuenta">Gestión de Cuenta</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                <Building size={16} />
                Departamento del Hospital (Opcional)
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input"
              >
                <option value="">Seleccionar departamento</option>
                <option value="Emergencia">Emergencia</option>
                <option value="UCI">UCI</option>
                <option value="Pediatría">Pediatría</option>
                <option value="Laboratorio">Laboratorio</option>
                <option value="Radiología">Radiología</option>
                <option value="Admisión">Admisión</option>
                <option value="Farmacia">Farmacia</option>
                <option value="Quirófano">Quirófano</option>
                <option value="Hospitalización">Hospitalización</option>
                <option value="Administración">Administración</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Sistemas">Sistemas</option>
              </select>
            </div>
          </div>

          <div style={actionsStyle}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Send size={16} />
              {loading ? 'Creando Ticket...' : 'Crear Ticket'}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onBack}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicketForm;