'use client';

import { useAuth } from '@/lib/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/products', label: 'Productos', icon: '🎨' },
  { href: '/dashboard/subscription', label: 'Suscripción', icon: '💳' },
  { href: '/dashboard/payments', label: 'Pagos', icon: '📄' },
  { href: '/dashboard/settings', label: 'Configuración', icon: '⚙️' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { brand, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ color: 'var(--text-muted)' }}>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-dark)',
      display: 'flex',
    }}>
      <aside style={{
        width: '260px',
        backgroundColor: 'var(--bg-card)',
        borderRight: '1px solid var(--border-color)',
        padding: '1.5rem 0',
        flexShrink: 0,
      }}>
        <div style={{
          padding: '0 1.5rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '1.5rem',
        }}>
          <Link href="/dashboard" style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 800,
            display: 'block',
          }}>
            <span style={{ color: 'var(--primary)' }}>RENDER</span>TRY
          </Link>
          {brand && (
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ color: 'var(--text-main)', fontWeight: 500 }}>{brand.name}</div>
              <div style={{
                display: 'inline-block',
                marginTop: '0.25rem',
                padding: '0.2rem 0.6rem',
                backgroundColor: 'var(--primary)',
                borderRadius: '50px',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#fff',
              }}>
                {brand.plan}
              </div>
            </div>
          )}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1.5rem',
                  color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'rgba(230, 57, 70, 0.1)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{
          marginTop: 'auto',
          padding: '1.5rem',
          borderTop: '1px solid var(--border-color)',
        }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
            }}
          >
            ← Ver sitio
          </Link>
        </div>
      </aside>

      <main style={{
        flex: 1,
        padding: '2rem',
        overflowY: 'auto',
      }}>
        {children}
      </main>
    </div>
  );
}