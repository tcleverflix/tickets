import React from 'react';
import TicketListItem from './TicketListItem';
import { Search, Filter, RefreshCw } from 'lucide-react';

const TicketList = ({ tickets, onTicketSelect, selectedTicket, loading, onRefresh }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [filterPriority, setFilterPriority] = React.useState('all');

  const filteredTickets = React.useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchTerm, filterStatus, filterPriority]);

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

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--text)',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const filtersStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    gap: '12px',
    alignItems: 'center'
  };

  const searchStyle = {
    position: 'relative'
  };

  const searchIconStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    width: '16px',
    height: '16px'
  };

  const searchInputStyle = {
    paddingLeft: '40px',
    fontSize: '14px'
  };

  const selectStyle = {
    padding: '8px 12px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    backgroundColor: 'var(--white)',
    fontSize: '14px',
    color: 'var(--text)',
    cursor: 'pointer'
  };

  const listStyle = {
    flex: 1,
    overflow: 'auto'
  };

  const emptyStyle = {
    padding: '48px 24px',
    textAlign: 'center',
    color: 'var(--text-light)'
  };

  const loadingStyle = {
    padding: '48px 24px',
    textAlign: 'center',
    color: 'var(--text-light)'
  };

  const refreshButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-light)',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={headerStyle}>
        <div style={titleStyle}>
          <span>Tickets ({filteredTickets.length})</span>
          <button
            style={refreshButtonStyle}
            onClick={onRefresh}
            disabled={loading}
            className={loading ? 'animate-pulse' : ''}
          >
            <RefreshCw size={16} style={{ transform: loading ? 'rotate(180deg)' : 'none' }} />
            Actualizar
          </button>
        </div>

        <div style={filtersStyle}>
          <div style={searchStyle}>
            <Search style={searchIconStyle} />
            <input
              type="text"
              placeholder="Buscar tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={searchInputStyle}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={selectStyle}
          >
            <option value="all">Todos los estados</option>
            <option value="abierto">Abierto</option>
            <option value="en_proceso">En Proceso</option>
            <option value="cerrado">Cerrado</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            style={selectStyle}
          >
            <option value="all">Todas las prioridades</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
        </div>
      </div>

      <div style={listStyle}>
        {loading ? (
          <div style={loadingStyle} className="animate-pulse">
            Cargando tickets...
          </div>
        ) : filteredTickets.length === 0 ? (
          <div style={emptyStyle}>
            {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
              ? 'No se encontraron tickets que coincidan con los filtros.'
              : 'No hay tickets disponibles. ¡Crea el primero!'
            }
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <TicketListItem
              key={ticket.id}
              ticket={ticket}
              onClick={onTicketSelect}
              isSelected={selectedTicket?.id === ticket.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TicketList;