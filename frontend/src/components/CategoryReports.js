import React, { useState, useEffect } from 'react';
import { ticketsApi } from '../services/api';

const CategoryReports = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await ticketsApi.getTickets({});
      setTickets(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ticketsData) => {
    const categories = {
      tecnico: { count: 0, open: 0, closed: 0, inProgress: 0 },
      facturacion: { count: 0, open: 0, closed: 0, inProgress: 0 },
      cuenta: { count: 0, open: 0, closed: 0, inProgress: 0 },
      producto: { count: 0, open: 0, closed: 0, inProgress: 0 },
      consulta: { count: 0, open: 0, closed: 0, inProgress: 0 },
      incidencia: { count: 0, open: 0, closed: 0, inProgress: 0 },
      solicitud: { count: 0, open: 0, closed: 0, inProgress: 0 },
      configuracion: { count: 0, open: 0, closed: 0, inProgress: 0 },
      instalacion: { count: 0, open: 0, closed: 0, inProgress: 0 },
      red: { count: 0, open: 0, closed: 0, inProgress: 0 },
      seguridad: { count: 0, open: 0, closed: 0, inProgress: 0 },
      hardware: { count: 0, open: 0, closed: 0, inProgress: 0 },
      software: { count: 0, open: 0, closed: 0, inProgress: 0 },
      email: { count: 0, open: 0, closed: 0, inProgress: 0 },
      rendimiento: { count: 0, open: 0, closed: 0, inProgress: 0 },
      otro: { count: 0, open: 0, closed: 0, inProgress: 0 },
      sin_categoria: { count: 0, open: 0, closed: 0, inProgress: 0 }
    };

    ticketsData.forEach(ticket => {
      const category = ticket.category || 'sin_categoria';
      if (categories[category]) {
        categories[category].count++;
        if (ticket.status === 'abierto') categories[category].open++;
        else if (ticket.status === 'cerrado') categories[category].closed++;
        else if (ticket.status === 'en_proceso') categories[category].inProgress++;
      }
    });

    setStats(categories);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      tecnico: '🔧',
      facturacion: '💳',
      cuenta: '👤',
      producto: '📦',
      consulta: '💬',
      incidencia: '⚠️',
      solicitud: '📝',
      configuracion: '⚙️',
      instalacion: '💿',
      red: '🌐',
      seguridad: '🔒',
      hardware: '🖥️',
      software: '💻',
      email: '📧',
      rendimiento: '⚡',
      otro: '📋',
      sin_categoria: '❓'
    };
    return icons[category] || '📁';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      tecnico: 'Técnico',
      facturacion: 'Facturación',
      cuenta: 'Cuenta y Acceso',
      producto: 'Producto/Servicio',
      consulta: 'Consulta General',
      incidencia: 'Incidencia/Error',
      solicitud: 'Solicitud de Cambio',
      configuracion: 'Configuración',
      instalacion: 'Instalación',
      red: 'Conectividad/Red',
      seguridad: 'Seguridad',
      hardware: 'Hardware',
      software: 'Software',
      email: 'Email',
      rendimiento: 'Rendimiento',
      otro: 'Otro',
      sin_categoria: 'Sin Categoría'
    };
    return labels[category] || category;
  };

  const getTotalTickets = () => {
    return Object.values(stats).reduce((sum, cat) => sum + cat.count, 0);
  };

  const containerStyle = {
    padding: '24px',
    backgroundColor: 'var(--background)',
    minHeight: '100vh'
  };

  const headerStyle = {
    marginBottom: '32px'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: 'var(--text-secondary)'
  };

  const summaryCardsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  };

  const summaryCardStyle = {
    backgroundColor: 'var(--white)',
    padding: '24px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    textAlign: 'center'
  };

  const summaryNumberStyle = {
    fontSize: '48px',
    fontWeight: '800',
    color: 'var(--primary)',
    marginBottom: '8px'
  };

  const summaryLabelStyle = {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const categoryGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px'
  };

  const categoryCardStyle = {
    backgroundColor: 'var(--white)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'default'
  };

  const categoryHeaderStyle = {
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const categoryBodyStyle = {
    padding: '24px'
  };

  const statRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid var(--border)'
  };

  const statLabelStyle = {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const statValueStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)'
  };

  const progressBarStyle = {
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '16px'
  };

  const progressFillStyle = (percentage) => ({
    height: '100%',
    width: `${percentage}%`,
    background: 'linear-gradient(90deg, #10b981, #059669)',
    transition: 'width 0.5s ease'
  });

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-secondary)' }}>
          Cargando reportes...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          <span>📊</span>
          Reportes por Categoría
        </h1>
        <p style={subtitleStyle}>
          Análisis detallado de tickets agrupados por categoría
        </p>
      </div>

      <div style={summaryCardsStyle}>
        <div style={summaryCardStyle}>
          <div style={summaryNumberStyle}>{getTotalTickets()}</div>
          <div style={summaryLabelStyle}>Total de Tickets</div>
        </div>

        <div style={summaryCardStyle}>
          <div style={{ ...summaryNumberStyle, color: '#10b981' }}>
            {Object.values(stats).reduce((sum, cat) => sum + cat.closed, 0)}
          </div>
          <div style={summaryLabelStyle}>Tickets Cerrados</div>
        </div>

        <div style={summaryCardStyle}>
          <div style={{ ...summaryNumberStyle, color: '#f59e0b' }}>
            {Object.values(stats).reduce((sum, cat) => sum + cat.inProgress, 0)}
          </div>
          <div style={summaryLabelStyle}>En Proceso</div>
        </div>

        <div style={summaryCardStyle}>
          <div style={{ ...summaryNumberStyle, color: '#ef4444' }}>
            {Object.values(stats).reduce((sum, cat) => sum + cat.open, 0)}
          </div>
          <div style={summaryLabelStyle}>Abiertos</div>
        </div>
      </div>

      <div style={categoryGridStyle}>
        {Object.entries(stats).map(([category, data]) => {
          if (data.count === 0) return null;

          const completionRate = data.count > 0
            ? Math.round((data.closed / data.count) * 100)
            : 0;

          return (
            <div key={category} style={categoryCardStyle}>
              <div style={categoryHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '32px' }}>{getCategoryIcon(category)}</span>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '600' }}>
                      {getCategoryLabel(category)}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }}>
                      {data.count} ticket{data.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '36px', fontWeight: '800' }}>
                  {data.count}
                </div>
              </div>

              <div style={categoryBodyStyle}>
                <div style={statRowStyle}>
                  <div style={statLabelStyle}>
                    <span>🔴</span>
                    Abiertos
                  </div>
                  <div style={statValueStyle}>{data.open}</div>
                </div>

                <div style={statRowStyle}>
                  <div style={statLabelStyle}>
                    <span>🟡</span>
                    En Proceso
                  </div>
                  <div style={statValueStyle}>{data.inProgress}</div>
                </div>

                <div style={statRowStyle}>
                  <div style={statLabelStyle}>
                    <span>🟢</span>
                    Cerrados
                  </div>
                  <div style={statValueStyle}>{data.closed}</div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Tasa de Resolución
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#10b981' }}>
                      {completionRate}%
                    </span>
                  </div>
                  <div style={progressBarStyle}>
                    <div style={progressFillStyle(completionRate)}></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {getTotalTickets() === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '64px',
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
            No hay datos para mostrar
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Crea algunos tickets para ver los reportes por categoría
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryReports;
