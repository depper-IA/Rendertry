'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  category: z.enum(['RIN', 'WRAP', 'PAINT']),
  imageUrl: z.string().url('URL inválida').or(z.literal('')).optional(),
  price: z.string().optional().transform(v => v ? parseFloat(v) : undefined),
  description: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

const categories = [
  { value: 'RIN', label: 'RIN', desc: 'Rines y ruedas', color: '#e63946' },
  { value: 'WRAP', label: 'WRAP', desc: 'Vinilos y envolturas', color: '#ffb347' },
  { value: 'PAINT', label: 'PAINT', desc: 'Pintura vehicular', color: '#4ecdc4' },
];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<ProductForm>({
    name: '',
    category: undefined as unknown as 'RIN' | 'WRAP' | 'PAINT',
    imageUrl: '',
    price: undefined,
    description: '',
  });

  const validate = () => {
    const result = productSchema.safeParse(form);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((e: z.ZodIssue) => {
        if (e.path[0]) {
          newErrors[e.path[0] as string] = e.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          imageUrl: form.imageUrl || undefined,
          price: typeof form.price === 'number' ? form.price : (form.price ? parseFloat(form.price) : undefined),
          metadata: form.description ? { description: form.description } : {},
        }),
      });

      if (res.ok) {
        router.push('/dashboard/products');
      } else {
        const data = await res.json();
        setErrors({ form: data.message || 'Error al crear producto' });
      }
    } catch {
      setErrors({ form: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/dashboard/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            marginBottom: '1rem',
          }}
        >
          ← Volver a productos
        </Link>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          marginBottom: '0.5rem',
        }}>
          Nuevo Producto
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Agrega un nuevo producto a tu catálogo
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: '600px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          padding: '2rem',
        }}
      >
        {errors.form && (
          <div style={{
            backgroundColor: 'rgba(230, 57, 70, 0.1)',
            border: '1px solid var(--primary)',
            borderRadius: '8px',
            padding: '1rem',
            color: 'var(--primary)',
            marginBottom: '1.5rem',
          }}>
            {errors.form}
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Nombre del producto *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Ej: Rin Deportivo XR-500"
            style={{
              ...inputStyle,
              borderColor: errors.name ? 'var(--primary)' : 'var(--border-color)',
            }}
          />
          {errors.name && <span style={errorStyle}>{errors.name}</span>}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Categoría *</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {categories.map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setForm({ ...form, category: cat.value as 'RIN' | 'WRAP' | 'PAINT' })}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '2px solid',
                  borderColor: form.category === cat.value ? cat.color : 'var(--border-color)',
                  backgroundColor: form.category === cat.value ? cat.color + '15' : 'var(--bg-dark)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  fontSize: '1.5rem',
                  marginBottom: '0.5rem',
                  color: cat.color,
                }}>
                  {cat.value === 'RIN' ? '⚙️' : cat.value === 'WRAP' ? '📐' : '🎨'}
                </div>
                <div style={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: form.category === cat.value ? cat.color : 'var(--text-main)',
                }}>
                  {cat.label}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.25rem',
                }}>
                  {cat.desc}
                </div>
              </button>
            ))}
          </div>
          {errors.category && <span style={errorStyle}>{errors.category}</span>}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>URL de imagen</label>
          <input
            type="url"
            value={form.imageUrl}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://ejemplo.com/imagen.jpg"
            style={{
              ...inputStyle,
              borderColor: errors.imageUrl ? 'var(--primary)' : 'var(--border-color)',
            }}
          />
          {errors.imageUrl && <span style={errorStyle}>{errors.imageUrl}</span>}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ссылка a la imagen del producto
          </span>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Precio (COP)</label>
          <input
            type="number"
            value={form.price ?? ''}
            onChange={e => setForm({ ...form, price: e.target.value ? parseFloat(e.target.value) : undefined })}
            placeholder="0"
            min="0"
            step="100"
            style={inputStyle}
          />
          {errors.price && <span style={errorStyle}>{errors.price}</span>}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={labelStyle}>Descripción</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Describe las características del producto..."
            rows={4}
            style={{
              ...inputStyle,
              resize: 'vertical',
              minHeight: '100px',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.875rem',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Creando...' : 'Crear producto'}
          </button>
          <Link
            href="/dashboard/products"
            style={{
              padding: '0.875rem 1.5rem',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontWeight: 600,
            }}
          >
            Cancelar
          </Link>
        </div>
      </form>
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
  transition: 'border-color 0.2s',
};

const errorStyle: React.CSSProperties = {
  display: 'block',
  marginTop: '0.25rem',
  color: 'var(--primary)',
  fontSize: '0.8rem',
};