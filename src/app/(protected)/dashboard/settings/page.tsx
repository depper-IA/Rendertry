'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Contraseña actual requerida'),
  newPassword: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe tener mayúscula')
    .regex(/[a-z]/, 'Debe tener minúscula')
    .regex(/[0-9]/, 'Debe tener número'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

interface BrandData {
  id: string;
  name: string;
  email: string;
  slug: string;
  plan: string;
  logo?: string;
}

export default function SettingsPage() {
  const { brand, refreshBrand } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (brand) {
      setProfileForm({
        name: brand.name || '',
        email: brand.email || '',
      });
    }
  }, [brand]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrors({});
    setSuccess(null);

    const parsed = profileSchema.safeParse(profileForm);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((err: z.ZodIssue) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setProfileErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profileForm),
      });

      if (res.ok) {
        setSuccess('Perfil actualizado correctamente');
        refreshBrand();
      } else {
        const data = await res.json();
        setProfileErrors({ form: data.message || 'Error al actualizar' });
      }
    } catch {
      setProfileErrors({ form: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrors({});
    setSuccess(null);

    const parsed = passwordSchema.safeParse(passwordForm);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((err: z.ZodIssue) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setPasswordErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (res.ok) {
        setSuccess('Contraseña cambiada correctamente');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const data = await res.json();
        setPasswordErrors({ form: data.message || 'Error al cambiar contraseña' });
      }
    } catch {
      setPasswordErrors({ form: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          marginBottom: '0.5rem',
        }}>
          Configuración
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Gestiona tu perfil y preferencias de cuenta
        </p>
      </div>

      {success && (
        <div style={{
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          border: '1px solid #2ecc71',
          borderRadius: '8px',
          padding: '1rem',
          color: '#2ecc71',
          marginBottom: '1.5rem',
        }}>
          {success}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem',
      }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '1.5rem',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            Información del Perfil
          </h2>

          <form onSubmit={handleProfileSubmit}>
            {profileErrors.form && (
              <div style={{
                backgroundColor: 'rgba(230, 57, 70, 0.1)',
                border: '1px solid var(--primary)',
                borderRadius: '8px',
                padding: '1rem',
                color: 'var(--primary)',
                marginBottom: '1rem',
              }}>
                {profileErrors.form}
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Nombre de la marca</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                style={{
                  ...inputStyle,
                  borderColor: profileErrors.name ? 'var(--primary)' : 'var(--border-color)',
                }}
              />
              {profileErrors.name && <span style={errorStyle}>{profileErrors.name}</span>}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                style={{
                  ...inputStyle,
                  borderColor: profileErrors.email ? 'var(--primary)' : 'var(--border-color)',
                }}
              />
              {profileErrors.email && <span style={errorStyle}>{profileErrors.email}</span>}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Slug</label>
              <input
                type="text"
                value={brand?.slug || ''}
                disabled
                style={{
                  ...inputStyle,
                  opacity: 0.6,
                  cursor: 'not-allowed',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                El slug no se puede cambiar
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '1.5rem',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            marginBottom: '1.5rem',
          }}>
            Cambiar Contraseña
          </h2>

          <form onSubmit={handlePasswordSubmit}>
            {passwordErrors.form && (
              <div style={{
                backgroundColor: 'rgba(230, 57, 70, 0.1)',
                border: '1px solid var(--primary)',
                borderRadius: '8px',
                padding: '1rem',
                color: 'var(--primary)',
                marginBottom: '1rem',
              }}>
                {passwordErrors.form}
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Contraseña actual</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                style={inputStyle}
              />
              {passwordErrors.currentPassword && <span style={errorStyle}>{passwordErrors.currentPassword}</span>}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Nueva contraseña</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Mínimo 8 caracteres, mayúscula, minúscula y número"
                style={inputStyle}
              />
              {passwordErrors.newPassword && <span style={errorStyle}>{passwordErrors.newPassword}</span>}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Confirmar nueva contraseña</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                style={{
                  ...inputStyle,
                  borderColor: passwordErrors.confirmPassword ? 'var(--primary)' : 'var(--border-color)',
                }}
              />
              {passwordErrors.confirmPassword && <span style={errorStyle}>{passwordErrors.confirmPassword}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Cambiando...' : 'Cambiar contraseña'}
            </button>
          </form>
        </div>
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          marginBottom: '1rem',
          color: 'var(--primary)',
        }}>
          Zona de Peligro
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Una vez eliminada tu cuenta, no hay vuelta atrás. Todos tus datos serán eliminados permanentemente.
        </p>
        <button
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: 'transparent',
            color: 'var(--primary)',
            border: '1px solid var(--primary)',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Eliminar mi cuenta
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.5rem',
  color: 'var(--text-muted)',
  fontSize: '0.875rem',
  fontWeight: 500,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  backgroundColor: 'var(--bg-dark)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  color: 'var(--text-main)',
  fontSize: '1rem',
};

const errorStyle: React.CSSProperties = {
  display: 'block',
  marginTop: '0.25rem',
  color: 'var(--primary)',
  fontSize: '0.8rem',
};