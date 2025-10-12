import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UserManagement = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    role: 'agent',
    is_active: true
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingUser) {
        // Update existing user
        await api.put(`/auth/users/${editingUser.id}`, formData);
      } else {
        // Create new user
        await api.post('/auth/register', formData);
      }

      loadUsers();
      handleCancel();
    } catch (error) {
      console.error('Error saving user:', error);
      setError(error.response?.data?.error || 'Error al guardar usuario');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // No mostrar contraseña actual
      full_name: user.full_name,
      role: user.role,
      is_active: user.is_active
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      full_name: '',
      role: 'agent',
      is_active: true
    });
    setError('');
  };

  const handleToggleActive = async (user) => {
    try {
      await api.put(`/auth/users/${user.id}`, {
        is_active: !user.is_active
      });
      loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Error al cambiar estado del usuario');
    }
  };

  // Styles
  const containerStyle = {
    padding: '24px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e5e7eb'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const addButtonStyle = {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const thStyle = {
    textAlign: 'left',
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    color: '#6b7280',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    borderBottom: '2px solid #e5e7eb'
  };

  const tdStyle = {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#374151'
  };

  const badgeStyle = (role) => ({
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: role === 'admin' ? '#dbeafe' : '#f3e8ff',
    color: role === 'admin' ? '#1e40af' : '#6b21a8'
  });

  const statusBadgeStyle = (isActive) => ({
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: isActive ? '#d1fae5' : '#fee2e2',
    color: isActive ? '#065f46' : '#991b1b'
  });

  const actionButtonStyle = {
    padding: '6px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    marginRight: '8px',
    transition: 'all 0.2s ease',
    backgroundColor: 'white'
  };

  const formStyle = {
    backgroundColor: '#f9fafb',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '24px'
  };

  const formGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const formButtonsStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px'
  };

  const cancelButtonStyle = {
    padding: '10px 20px',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280'
  };

  const submitButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white'
  };

  if (currentUser.role !== 'admin') {
    return (
      <div style={containerStyle}>
        <p style={{ color: '#ef4444', textAlign: 'center', padding: '40px' }}>
          ⚠️ Solo los administradores pueden acceder a esta sección
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          👥 Gestión de Soportes
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={addButtonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#2563eb')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#3b82f6')}
          >
            ➕ Nuevo Soporte
          </button>
        )}
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {showForm && (
        <div style={formStyle}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1f2937' }}>
            {editingUser ? '✏️ Editar Soporte' : '➕ Nuevo Soporte'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Usuario *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="nombre_usuario"
                  required
                  disabled={editingUser !== null}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Nombre Completo *</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Juan Pérez"
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>
                  {editingUser ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="••••••••"
                  required={!editingUser}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Rol *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={selectStyle}
                  required
                >
                  <option value="agent">Agente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    style={{ marginRight: '8px' }}
                  />
                  Usuario Activo
                </label>
              </div>
            </div>

            <div style={formButtonsStyle}>
              <button
                type="button"
                onClick={handleCancel}
                style={cancelButtonStyle}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={submitButtonStyle}
              >
                {editingUser ? 'Guardar Cambios' : 'Crear Soporte'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          Cargando usuarios...
        </div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Usuario</th>
              <th style={thStyle}>Nombre Completo</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Rol</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={tdStyle}>
                  <strong>{user.username}</strong>
                </td>
                <td style={tdStyle}>{user.full_name}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>
                  <span style={badgeStyle(user.role)}>
                    {user.role === 'admin' ? '👑 Admin' : '👤 Agente'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <span style={statusBadgeStyle(user.is_active)}>
                    {user.is_active ? '✅ Activo' : '❌ Inactivo'}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={actionButtonStyle}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleToggleActive(user)}
                    style={{
                      ...actionButtonStyle,
                      color: user.is_active ? '#dc2626' : '#16a34a'
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                  >
                    {user.is_active ? '🚫 Desactivar' : '✅ Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && users.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          No hay usuarios registrados
        </div>
      )}
    </div>
  );
};

export default UserManagement;
