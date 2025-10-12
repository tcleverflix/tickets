import React, { useState } from 'react';
import { ticketsApi } from '../services/api';

const NewTicketFormPremium = ({ onBack, onTicketCreated }) => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    subject: '',
    description: '',
    category: 'tecnico',
    priority: 'media',
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
      newErrors.client_name = 'El nombre completo es obligatorio';
    }

    if (!formData.client_email.trim()) {
      newErrors.client_email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.client_email)) {
      newErrors.client_email = 'Por favor ingrese un correo válido';
    }

    // Validación opcional para teléfono móvil (10-15 dígitos)
    if (formData.client_phone && !/^\+?[0-9\s-]{8,15}$/.test(formData.client_phone)) {
      newErrors.client_phone = 'Ingrese un número de celular válido';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'El asunto es obligatorio';
    } else if (formData.subject.length < 10) {
      newErrors.subject = 'El asunto debe tener al menos 10 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Por favor describa su problema con más detalle (mínimo 20 caracteres)';
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
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Error al crear el ticket. Por favor intente nuevamente.');
      setLoading(false);
    }
  };

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '50px',
    maxWidth: '800px',
    width: '100%',
    boxShadow: '0 30px 90px rgba(0, 0, 0, 0.3)',
    animation: 'slideUp 0.5s ease-out'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px'
  };

  const titleStyle = {
    fontSize: '36px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '12px'
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '8px'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '28px'
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  const labelStyle = {
    fontSize: '15px',
    fontWeight: '600',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const requiredStyle = {
    color: '#ef4444',
    fontSize: '18px'
  };

  const inputStyle = {
    padding: '16px 20px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: '#f9fafb',
    fontFamily: 'inherit'
  };

  const inputFocusStyle = {
    borderColor: '#667eea',
    backgroundColor: 'white',
    boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '140px',
    resize: 'vertical',
    fontFamily: 'inherit'
  };

  const errorStyle = {
    color: '#ef4444',
    fontSize: '14px',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  const priorityGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px'
  };

  const priorityButtonStyle = (priority, isSelected) => ({
    padding: '16px',
    border: `2px solid ${isSelected ? '#667eea' : '#e5e7eb'}`,
    borderRadius: '12px',
    backgroundColor: isSelected ? '#f0f4ff' : 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '600'
  });

  const buttonContainerStyle = {
    display: 'flex',
    gap: '16px',
    marginTop: '20px'
  };

  const submitButtonStyle = {
    flex: 1,
    padding: '18px',
    fontSize: '17px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
    opacity: loading ? 0.7 : 1
  };

  const backButtonStyle = {
    padding: '18px 32px',
    fontSize: '17px',
    fontWeight: '600',
    color: '#6b7280',
    backgroundColor: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const priorityColors = {
    baja: { color: '#10b981', bg: '#d1fae5', label: '🟢 Baja' },
    media: { color: '#f59e0b', bg: '#fef3c7', label: '🟡 Media' },
    alta: { color: '#ef4444', bg: '#fee2e2', label: '🔴 Alta' },
    critica: { color: '#7c3aed', bg: '#ede9fe', label: '🟣 Crítica' }
  };

  const styleTag = `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
    }

    .back-btn:hover {
      border-color: #667eea;
      color: #667eea;
    }

    .priority-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .form-input:focus {
      border-color: #667eea;
      background-color: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }
  `;

  return (
    <>
      <style>{styleTag}</style>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎫</div>
            <h1 style={titleStyle}>Nuevo Ticket de Soporte</h1>
            <p style={subtitleStyle}>
              Complete el formulario y nuestro equipo le contactará a la brevedad
            </p>
          </div>

  <form onSubmit={handleSubmit} style={formStyle}>
            {/* Nombre Completo */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                👤 Nombre Completo
                <span style={requiredStyle}>*</span>
              </label>
              <input
                className="form-input"
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Ingrese su nombre completo"
                disabled={loading}
              />
              {errors.client_name && (
                <div style={errorStyle}>
                  <span>⚠️</span>
                  {errors.client_name}
                </div>
              )}
            </div>

            {/* Correo Electrónico */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                📧 Correo Electrónico
                <span style={requiredStyle}>*</span>
              </label>
              <input
                className="form-input"
                type="email"
                name="client_email"
                value={formData.client_email}
                onChange={handleChange}
                style={inputStyle}
                placeholder="ejemplo@correo.com"
                disabled={loading}
              />
              {errors.client_email && (
                <div style={errorStyle}>
                  <span>⚠️</span>
                  {errors.client_email}
                </div>
              )}
            </div>

            {/* Número de Celular */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                📱 Número de Celular
              </label>
              <input
                className="form-input"
                type="tel"
                name="client_phone"
                value={formData.client_phone}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Ej: +51 999 999 999"
                disabled={loading}
              />
              {errors.client_phone && (
                <div style={errorStyle}>
                  <span>⚠️</span>
                  {errors.client_phone}
                </div>
              )}
            </div>

            {/* Asunto */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                📝 Asunto
                <span style={requiredStyle}>*</span>
              </label>
              <input
                className="form-input"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Resuma su problema o consulta"
                disabled={loading}
              />
              {errors.subject && (
                <div style={errorStyle}>
                  <span>⚠️</span>
                  {errors.subject}
                </div>
              )}
            </div>

            {/* Categoría */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                🏷️ Categoría
                <span style={requiredStyle}>*</span>
              </label>
              <select
                className="form-input"
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{...inputStyle, cursor: 'pointer'}}
                disabled={loading}
              >
                <option value="tecnico">🔧 Técnico</option>
                <option value="facturacion">💳 Facturación</option>
                <option value="cuenta">👤 Cuenta y Acceso</option>
                <option value="producto">📦 Producto/Servicio</option>
                <option value="consulta">💬 Consulta General</option>
                <option value="incidencia">⚠️ Incidencia/Error</option>
                <option value="solicitud">📝 Solicitud de Cambio</option>
                <option value="configuracion">⚙️ Configuración</option>
                <option value="instalacion">💿 Instalación</option>
                <option value="red">🌐 Conectividad/Red</option>
                <option value="seguridad">🔒 Seguridad</option>
                <option value="hardware">🖥️ Hardware</option>
                <option value="software">💻 Software</option>
                <option value="email">📧 Email</option>
                <option value="rendimiento">⚡ Rendimiento</option>
                <option value="otro">📋 Otro</option>
              </select>
            </div>

            {/* Departamento (Hospital) */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                🏥 Departamento del Hospital
              </label>
              <select
                className="form-input"
                name="department"
                value={formData.department}
                onChange={handleChange}
                style={{...inputStyle, cursor: 'pointer'}}
                disabled={loading}
              >
                <option value="">Seleccione departamento</option>
                <option value="Emergencia">🚑 Emergencia</option>
                <option value="UCI">🫁 UCI</option>
                <option value="Pediatría">🧸 Pediatría</option>
                <option value="Laboratorio">🧪 Laboratorio</option>
                <option value="Radiología">🩻 Radiología</option>
                <option value="Admisión">🧾 Admisión</option>
                <option value="Farmacia">💊 Farmacia</option>
                <option value="Quirófano">🔪 Quirófano</option>
                <option value="Hospitalización">🛏️ Hospitalización</option>
                <option value="Administración">🏢 Administración</option>
                <option value="Mantenimiento">🛠️ Mantenimiento</option>
                <option value="Sistemas">💻 Sistemas</option>
              </select>
            </div>

            {/* Descripción */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                📋 Descripción Detallada
                <span style={requiredStyle}>*</span>
              </label>
              <textarea
                className="form-input"
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={textareaStyle}
                placeholder="Describa su problema con el mayor detalle posible. Esto nos ayudará a brindarle una mejor solución."
                disabled={loading}
              />
              {errors.description && (
                <div style={errorStyle}>
                  <span>⚠️</span>
                  {errors.description}
                </div>
              )}
            </div>

            {/* Prioridad */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                ⚡ Nivel de Prioridad
                <span style={requiredStyle}>*</span>
              </label>
              <div style={priorityGridStyle}>
                {Object.entries(priorityColors).map(([key, { color, bg, label }]) => (
                  <button
                    key={key}
                    type="button"
                    className="priority-btn"
                    onClick={() => setFormData(prev => ({ ...prev, priority: key }))}
                    style={{
                      ...priorityButtonStyle(key, formData.priority === key),
                      color: formData.priority === key ? color : '#6b7280',
                      backgroundColor: formData.priority === key ? bg : 'white'
                    }}
                    disabled={loading}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div style={buttonContainerStyle}>
              <button
                type="button"
                className="back-btn"
                onClick={onBack}
                style={backButtonStyle}
                disabled={loading}
              >
                ← Volver
              </button>
              <button
                type="submit"
                className="submit-btn"
                style={submitButtonStyle}
                disabled={loading}
              >
                {loading ? (
                  <>⏳ Creando Ticket...</>
                ) : (
                  <>✨ Crear Ticket de Atención</>
                )}
              </button>
            </div>

            <div style={{
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '14px',
              marginTop: '16px',
              padding: '20px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px'
            }}>
              <p style={{ margin: '0 0 8px 0' }}>
                🔒 Su información está segura y será tratada con total confidencialidad
              </p>
              <p style={{ margin: 0 }}>
                Recibirá una confirmación por correo electrónico en breve
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewTicketFormPremium;
