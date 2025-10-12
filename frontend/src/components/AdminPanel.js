import React, { useState, useEffect } from 'react';
import { ticketsApi } from '../services/api';
import TicketDetail from './TicketDetail';
import UserManagement from './UserManagement';
import CategoryReports from './CategoryReports';

const AdminPanel = ({ currentUser, onLogout }) => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('unassigned'); // 'unassigned', 'mine', 'all', 'closed'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'tecnico', 'facturacion', etc.
  const [activeView, setActiveView] = useState('tickets'); // 'tickets', 'users', or 'reports'

  useEffect(() => {
    loadTickets();
  }, [filter]);

  const loadTickets = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};

      if (filter === 'unassigned') {
        params.assigned = 'false';
      } else if (filter === 'mine') {
        params.assigned_to_id = currentUser.id;
      } else if (filter === 'closed') {
        params.status = 'cerrado';
      }

      const response = await ticketsApi.getTickets(params);
      setTickets(response.data);
    } catch (error) {
      console.error('Error loading tickets:', error);
      setError('Error al cargar los tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleTicketUpdate = (updatedTicket) => {
    setTickets(prev =>
      prev.map(ticket =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
    setSelectedTicket(updatedTicket);
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: 'var(--background)',
    display: 'flex',
    flexDirection: 'column'
  };

  const headerStyle = {
    backgroundColor: 'var(--white)',
    padding: '16px 24px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const headerTitleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const logoutButtonStyle = {
    padding: '8px 16px',
    backgroundColor: 'var(--error)',
    color: 'var(--white)',
    border: 'none',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const mainStyle = {
    flex: 1,
    display: 'flex',
    gap: '24px',
    padding: '24px'
  };

  const sidebarStyle = {
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const filterCardStyle = {
    backgroundColor: 'var(--white)',
    padding: '20px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)'
  };

  const filterButtonStyle = (isActive) => ({
    padding: '12px 16px',
    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
    color: isActive ? 'var(--white)' : 'var(--text-primary)',
    border: isActive ? 'none' : '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s'
  });

  const contentStyle = {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: selectedTicket ? '400px 1fr' : '1fr',
    gap: '24px'
  };

  const ticketListStyle = {
    backgroundColor: 'var(--white)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    overflow: 'hidden'
  };

  const ticketItemStyle = (isSelected) => ({
    padding: '16px',
    borderBottom: '1px solid var(--border)',
    cursor: 'pointer',
    backgroundColor: isSelected ? '#f0f9ff' : 'transparent',
    transition: 'background-color 0.2s'
  });

  const getPriorityColor = (priority) => {
    const colors = {
      'baja': '#10b981',
      'media': '#f59e0b',
      'alta': '#ef4444',
      'critica': '#7c3aed'
    };
    return colors[priority] || '#6b7280';
  };

  const getFilterCount = () => {
    return tickets.length;
  };

  const getFilterLabel = () => {
    switch (filter) {
      case 'unassigned':
        return 'Sin Asignar';
      case 'mine':
        return 'Mis Tickets';
      case 'all':
        return 'Todos';
      case 'closed':
        return 'Cerrados';
      default:
        return '';
    }
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={headerTitleStyle}>
          <span style={{ fontSize: '24px' }}>🎫</span>
          <h1 style={{ margin: 0, fontSize: '20px' }}>Panel de Administración</h1>
        </div>
        <div style={userInfoStyle}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>{currentUser.full_name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {currentUser.role === 'admin' ? 'Administrador' : 'Agente'}
            </div>
          </div>
          <button
            onClick={onLogout}
            style={logoutButtonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#dc2626')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--error)')}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainStyle}>
        {/* Sidebar with Filters */}
        <div style={sidebarStyle}>
          {/* Navigation Tabs */}
          <div style={filterCardStyle}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Navegación</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setActiveView('tickets')}
                style={filterButtonStyle(activeView === 'tickets')}
              >
                <span>🎫 Tickets</span>
              </button>
              {currentUser.role === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveView('reports')}
                    style={filterButtonStyle(activeView === 'reports')}
                  >
                    <span>📊 Reportes</span>
                  </button>
                  <button
                    onClick={() => setActiveView('users')}
                    style={filterButtonStyle(activeView === 'users')}
                  >
                    <span>👥 Administrar Soportes</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Filtros solo para vista de tickets */}
          {activeView === 'tickets' && (
            <>
              <div style={filterCardStyle}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Filtros</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => setFilter('unassigned')}
                    style={filterButtonStyle(filter === 'unassigned')}
                  >
                    <span>📋 Sin Asignar</span>
                    {filter === 'unassigned' && <span style={{ fontWeight: 'bold' }}>{getFilterCount()}</span>}
                  </button>
                  <button
                    onClick={() => setFilter('mine')}
                    style={filterButtonStyle(filter === 'mine')}
                  >
                    <span>👤 Mis Tickets</span>
                    {filter === 'mine' && <span style={{ fontWeight: 'bold' }}>{getFilterCount()}</span>}
                  </button>
                  <button
                    onClick={() => setFilter('all')}
                    style={filterButtonStyle(filter === 'all')}
                  >
                    <span>📊 Todos</span>
                    {filter === 'all' && <span style={{ fontWeight: 'bold' }}>{getFilterCount()}</span>}
                  </button>
                  <button
                    onClick={() => setFilter('closed')}
                    style={filterButtonStyle(filter === 'closed')}
                  >
                    <span>✅ Cerrados</span>
                    {filter === 'closed' && <span style={{ fontWeight: 'bold' }}>{getFilterCount()}</span>}
                  </button>
                </div>
              </div>

              <div style={filterCardStyle}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Categorías</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                  <button
                    onClick={() => setCategoryFilter('all')}
                    style={filterButtonStyle(categoryFilter === 'all')}
                  >
                    <span>📁 Todas</span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('tecnico')}
                    style={filterButtonStyle(categoryFilter === 'tecnico')}
                  >
                    <span>🔧 Técnico</span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('facturacion')}
                    style={filterButtonStyle(categoryFilter === 'facturacion')}
                  >
                    <span>💳 Facturación</span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('cuenta')}
                    style={filterButtonStyle(categoryFilter === 'cuenta')}
                  >
                    <span>👤 Cuenta</span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('producto')}
                    style={filterButtonStyle(categoryFilter === 'producto')}
                  >
                    <span>📦 Producto</span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('consulta')}
                    style={filterButtonStyle(categoryFilter === 'consulta')}
                  >
                    <span>💬 Consulta</span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('incidencia')}
                    style={filterButtonStyle(categoryFilter === 'incidencia')}
                  >
                    <span>⚠️ Incidencia</span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('solicitud')}
                    style={filterButtonStyle(categoryFilter === 'solicitud')}
                  >
                    <span>📝 Solicitud</span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('configuracion')}
                    style={filterButtonStyle(categoryFilter === 'configuracion')}
                  >
                    <span>⚙️ Configuración</span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('instalacion')}
                    style={filterButtonStyle(categoryFilter === 'instalacion')}
                  >
                    <span>💿 Instalación</span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('red')}
                    style={filterButtonStyle(categoryFilter === 'red')}
                  >
                    <span>🌐 Red</span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('seguridad')}
                    style={filterButtonStyle(categoryFilter === 'seguridad')}
                  >
                    <span>🔒 Seguridad</span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('hardware')}
                    style={filterButtonStyle(categoryFilter === 'hardware')}
                  >
                    <span>🖥️ Hardware</span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('software')}
                    style={filterButtonStyle(categoryFilter === 'software')}
                  >
                    <span>💻 Software</span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('email')}
                    style={filterButtonStyle(categoryFilter === 'email')}
                  >
                    <span>📧 Email</span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('rendimiento')}
                    style={filterButtonStyle(categoryFilter === 'rendimiento')}
                  >
                    <span>⚡ Rendimiento</span>
                  </button>
                  <button
                    onClick={() => setCategoryFilter('otro')}
                    style={filterButtonStyle(categoryFilter === 'otro')}
                  >
                    <span>📋 Otro</span>
                  </button>
                </div>
              </div>

              <div style={filterCardStyle}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Vista Actual
                </h3>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {getFilterCount()}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {getFilterLabel()}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Content Area */}
        {activeView === 'users' ? (
          <div style={{ flex: 1 }}>
            <UserManagement currentUser={currentUser} />
          </div>
        ) : activeView === 'reports' ? (
          <div style={{ flex: 1 }}>
            <CategoryReports />
          </div>
        ) : (
          <>
            {/* Tickets List and Detail */}
            <div style={contentStyle}>
              {/* Tickets List */}
              <div style={ticketListStyle}>
            <div style={{ padding: '16px', borderBottom: '2px solid var(--border)', fontWeight: '600' }}>
              {getFilterLabel()} ({getFilterCount()})
            </div>

            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Cargando tickets...
              </div>
            ) : error ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--error)' }}>
                {error}
              </div>
            ) : tickets.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No hay tickets en esta categoría
              </div>
            ) : (
              <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                {tickets.filter(ticket => categoryFilter === 'all' || ticket.category === categoryFilter).map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    style={ticketItemStyle(selectedTicket?.id === ticket.id)}
                    onMouseEnter={(e) => {
                      if (selectedTicket?.id !== ticket.id) {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTicket?.id !== ticket.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', fontSize: '14px' }}>#{ticket.id}</span>
                      <span
                        style={{
                          padding: '2px 8px',
                          backgroundColor: getPriorityColor(ticket.priority),
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          fontWeight: '600'
                        }}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <div style={{ fontWeight: '500', marginBottom: '4px', fontSize: '14px' }}>
                      {ticket.subject}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      {ticket.client_name}
                    </div>
                    {ticket.category && (
                      <div style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        backgroundColor: '#f3f4f6',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        marginTop: '4px'
                      }}>
                        {ticket.category === 'tecnico' && '🔧 Técnico'}
                        {ticket.category === 'facturacion' && '💳 Facturación'}
                        {ticket.category === 'cuenta' && '👤 Cuenta'}
                        {ticket.category === 'producto' && '📦 Producto'}
                        {ticket.category === 'consulta' && '💬 Consulta'}
                        {ticket.category === 'incidencia' && '⚠️ Incidencia'}
                        {ticket.category === 'solicitud' && '📝 Solicitud'}
                        {ticket.category === 'configuracion' && '⚙️ Configuración'}
                        {ticket.category === 'instalacion' && '💿 Instalación'}
                        {ticket.category === 'red' && '🌐 Red'}
                        {ticket.category === 'seguridad' && '🔒 Seguridad'}
                        {ticket.category === 'hardware' && '🖥️ Hardware'}
                        {ticket.category === 'software' && '💻 Software'}
                        {ticket.category === 'email' && '📧 Email'}
                        {ticket.category === 'rendimiento' && '⚡ Rendimiento'}
                        {ticket.category === 'otro' && '📋 Otro'}
                      </div>
                    )}
                    {ticket.assigned_to && (
                      <div style={{
                        fontSize: '11px',
                        color: 'var(--primary)',
                        marginTop: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        👤 {ticket.assigned_to.full_name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

              {/* Ticket Detail */}
              {selectedTicket && (
                <div style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <TicketDetail
                    ticket={selectedTicket}
                    onBack={() => setSelectedTicket(null)}
                    onTicketUpdate={handleTicketUpdate}
                    isAdminView={true}
                    currentUser={currentUser}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
