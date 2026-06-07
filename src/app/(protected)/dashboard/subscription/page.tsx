'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';

interface SubscriptionInfo {
  status: string;
  plan: string;
  startDate: string | null;
  endDate: string | null;
  daysRemaining: number | null;
  isInTrial: boolean;
  trialEndDate: string | null;
  trialDaysRemaining: number | null;
}

const PLANS: Record<string, {
  name: string;
  price: number;
  description: string;
  popular?: boolean;
  features: string[];
}> = {
  basic: {
    name: 'Básico',
    price: 0,
    description: 'Para comenzar',
    features: [
      'Hasta 5 productos',
      'Generaciones ilimitadas',
      'Soporte por email',
      'Reportes básicos',
    ],
  },
  pro: {
    name: 'Pro',
    price: 49900,
    description: 'Para negocios en crecimiento',
    popular: true,
    features: [
      'Hasta 15 productos',
      'Generaciones ilimitadas',
      'Soporte prioritario',
      'Categorías avanzadas',
      'Exportación en alta calidad',
    ],
  },
  business: {
    name: 'Business',
    price: 149900,
    description: 'Para empresas',
    features: [
      'Productos ilimitados',
      'Generaciones ilimitadas',
      'Soporte dedicado 24/7',
      'API access completo',
      'White-label',
      'Gestión de usuarios',
    ],
  },
};

export default function SubscriptionPage() {
  const { brand, refreshBrand } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, [brand]);

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/subscriptions', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al cargar suscripción' });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async (planName: string) => {
    if (!brand) return;

    setUpdating(true);
    setMessage(null);

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ plan: planName }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: `¡Plan actualizado a ${PLANS[planName as keyof typeof PLANS].name} exitosamente!` });
        await fetchSubscription();
        await refreshBrand();
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al actualizar plan' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al procesar el cambio de plan' });
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getPlanBadge = (plan: string) => {
    const planKey = plan.toLowerCase();
    if (planKey === 'basic' || planKey === 'pro' || planKey === 'business') {
      return planKey;
    }
    return 'basic';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
        Cargando información de suscripción...
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
          Mi Suscripción
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Gestiona tu plan y ciclo de facturació
        </p>
      </div>

      {message && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          backgroundColor: message.type === 'success' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(230, 57, 70, 0.15)',
          color: message.type === 'success' ? '#2ecc71' : 'var(--primary)',
          border: `1px solid ${message.type === 'success' ? '#2ecc71' : 'var(--primary)'}`,
        }}>
          {message.text}
        </div>
      )}

      {subscription && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                backgroundColor: 'var(--primary)',
                borderRadius: '50px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#fff',
              }}>
                {subscription.plan}
              </span>
              <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                backgroundColor: subscription.status === 'active' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(230, 57, 70, 0.2)',
                borderRadius: '50px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: subscription.status === 'active' ? '#2ecc71' : 'var(--primary)',
              }}>
                {subscription.status === 'active' ? 'Activo' : subscription.status}
              </span>
              {subscription.isInTrial && (
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'rgba(255, 179, 71, 0.2)',
                  borderRadius: '50px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--secondary)',
                }}>
                  Trial
                </span>
              )}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {subscription.isInTrial ? (
                <>Trial termina: {formatDate(subscription.trialEndDate)} ({subscription.trialDaysRemaining} días restantes)</>
              ) : subscription.endDate ? (
                <>Renovación: {formatDate(subscription.endDate)} ({subscription.daysRemaining} días restantes)</>
              ) : (
                <>Inicio: {formatDate(subscription.startDate)}</>
              )}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Plan actual
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {PLANS[getPlanBadge(subscription.plan) as keyof typeof PLANS]?.name || subscription.plan}
            </div>
          </div>
        </div>
      )}

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        Planes Disponibles
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}>
        {Object.entries(PLANS).map(([key, plan]) => {
          const isCurrentPlan = subscription?.plan.toLowerCase() === key;
          const isPopular = plan.popular;

          return (
            <div
              key={key}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '12px',
                border: isPopular ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {isPopular && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '50px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}>
                  Popular
                </div>
              )}

              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                marginBottom: '0.25rem',
              }}>
                {plan.name}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {plan.description}
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800 }}>
                  {formatPrice(plan.price)}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>/mes</span>
              </div>

              <ul style={{ listStyle: 'none', marginBottom: '1.5rem' }}>
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem',
                    }}
                  >
                    <span style={{ color: 'var(--primary)' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanChange(key)}
                disabled={isCurrentPlan || updating}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  backgroundColor: isCurrentPlan ? 'var(--bg-dark)' : 'var(--primary)',
                  color: isCurrentPlan ? 'var(--text-muted)' : '#fff',
                  border: isCurrentPlan ? '1px solid var(--border-color)' : 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: isCurrentPlan ? 'not-allowed' : 'pointer',
                  opacity: isCurrentPlan ? 0.6 : 1,
                }}
              >
                {updating ? 'Procesando...' : isCurrentPlan ? 'Plan actual' : (subscription?.plan.toLowerCase() === key ? 'Plan actual' : 'Cambiar plan')}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
      }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
          ¿Necesitas algo diferente?
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Contáctanos para Planes Empresariales con funciones personalizadas, soporte dedicado y más.
        </p>
        <a
          href="mailto:ventas@rendertry.com"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.25rem',
            backgroundColor: 'transparent',
            color: 'var(--secondary)',
            border: '1px solid var(--secondary)',
            borderRadius: '8px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Contactar ventas
        </a>
      </div>
    </div>
  );
}
