'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: string;
  invoiceUrl: string | null;
  plan: string;
  months: number;
  method: string | null;
}

export default function PaymentsPage() {
  const { brand } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (brand) {
      fetchPayments();
    }
  }, [brand]);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/payments', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch {
      console.error('Error fetching payments');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(cents);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { label: 'Completado', color: '#2ecc71', bg: 'rgba(46, 204, 113, 0.15)' };
      case 'pending':
        return { label: 'Pendiente', color: 'var(--secondary)', bg: 'rgba(255, 179, 71, 0.15)' };
      case 'failed':
        return { label: 'Fallido', color: 'var(--primary)', bg: 'rgba(230, 57, 70, 0.15)' };
      default:
        return { label: status, color: 'var(--text-muted)', bg: 'var(--bg-card)' };
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
        Cargando historial de pagos...
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          marginBottom: '0.5rem',
        }}>
          Historial de Pagos
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Descarga tus facturas y consulta el estado de tus pagos
        </p>
      </div>

      {payments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
          <h3 style={{ marginBottom: '0.5rem' }}>No hay pagos registrados</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Tu historial de pagos aparecerá aquí cuando realices tu primera suscripción
          </p>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={thStyle}>Fecha</th>
                <th style={thStyle}>Monto</th>
                <th style={thStyle}>Estado</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Factura</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => {
                const badge = getStatusBadge(payment.status);
                return (
                  <tr
                    key={payment.id}
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                  >
                    <td style={tdStyle}>
                      <div>{formatDate(payment.date)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {payment.plan} · {payment.months > 1 ? `${payment.months} meses` : '1 mes'}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 600 }}>
                        {formatPrice(payment.amount)}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: badge.bg,
                        color: badge.color,
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      {payment.invoiceUrl ? (
                        <a
                          href={payment.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.5rem 0.75rem',
                            backgroundColor: 'var(--bg-dark)',
                            color: 'var(--text-muted)',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            textDecoration: 'none',
                          }}
                        >
                          ⬇️ Descargar
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
      }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
          ¿Tienes preguntas sobre tu facturación?
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Si necesitas una factura formal o tienes dudas sobre algún cobro, contacta a nuestro equipo de soporte en{' '}
          <a href="mailto:billing@rendertry.com" style={{ color: 'var(--secondary)' }}>
            billing@rendertry.com
          </a>
        </p>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '1rem',
  textAlign: 'left',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tdStyle: React.CSSProperties = {
  padding: '1rem',
  fontSize: '0.9rem',
};
