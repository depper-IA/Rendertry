'use client';

import { useAuth } from '@/lib/AuthContext';

export default function DashboardPage() {
  const { brand } = useAuth();

  return (
    <div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '2rem',
        marginBottom: '1.5rem',
      }}>
        Dashboard
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '1.5rem',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Bienvenido</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {brand?.name || 'Cargando...'}
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '1.5rem',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎨</div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Productos</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Gestiona tu catálogo
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '1.5rem',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Suscripción</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Plan: {brand?.plan || 'Cargando...'}
          </p>
        </div>
      </div>
    </div>
  );
}