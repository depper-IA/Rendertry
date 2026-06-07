'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: 'RIN' | 'WRAP' | 'PAINT';
  price: number | null;
  badge: string | null;
  metadata: Record<string, any>;
  isActive: boolean;
  createdAt: string;
}

type CategoryFilter = 'TODOS' | 'RIN' | 'WRAP' | 'PAINT';

const categoryColors: Record<string, string> = {
  RIN: '#e63946',
  WRAP: '#ffb347',
  PAINT: '#4ecdc4',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CategoryFilter>('TODOS');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = filter === 'TODOS'
        ? '/api/products'
        : `/api/products?category=${filter}`;

      const res = await fetch(url, { credentials: 'include' });

      if (!res.ok) {
        throw new Error('Error al cargar productos');
      }

      const data = await res.json();
      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        const data = await res.json();
        alert(data.message || 'Error al eliminar');
      }
    } catch {
      alert('Error al eliminar producto');
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return '-';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            marginBottom: '0.5rem',
          }}>
            Mis Productos
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Gestiona tu catálogo de personalización vehicular
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          + Nuevo producto
        </Link>
      </div>

      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem',
      }}>
        {(['TODOS', 'RIN', 'WRAP', 'PAINT'] as CategoryFilter[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: filter === cat ? 'var(--primary)' : 'var(--border-color)',
              backgroundColor: filter === cat ? 'rgba(230, 57, 70, 0.1)' : 'transparent',
              color: filter === cat ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: filter === cat ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {cat === 'TODOS' ? 'Todos' : cat}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--text-muted)',
        }}>
          Cargando productos...
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: 'rgba(230, 57, 70, 0.1)',
          border: '1px solid var(--primary)',
          borderRadius: '8px',
          padding: '1rem',
          color: 'var(--primary)',
          marginBottom: '1.5rem',
        }}>
          {error}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
          <h3 style={{ marginBottom: '0.5rem' }}>No hay productos</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {filter === 'TODOS'
              ? 'Comienza agregando tu primer producto'
              : `No hay productos en ${filter}`}
          </p>
          <Link
            href="/dashboard/products/new"
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 600,
            }}
          >
            Crear producto
          </Link>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={thStyle}>Producto</th>
                <th style={thStyle}>Categoría</th>
                <th style={thStyle}>Precio</th>
                <th style={thStyle}>Fecha</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  style={{ borderBottom: '1px solid var(--border-color)' }}
                >
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{
                            width: '48px',
                            height: '48px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            backgroundColor: 'var(--bg-dark)',
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-dark)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                        }}>
                          🎨
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {product.name}
                          {product.badge && (
                            <span style={{
                              fontSize: '0.65rem',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '50px',
                              backgroundColor: categoryColors[product.category],
                              color: '#000',
                              fontWeight: 700,
                            }}>
                              {product.badge}
                            </span>
                          )}
                        </div>
                        {product.description && (
                          <div style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {product.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '50px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: categoryColors[product.category] + '22',
                      color: categoryColors[product.category],
                    }}>
                      {product.category}
                    </span>
                  </td>
                  <td style={tdStyle}>{formatPrice(product.price)}</td>
                  <td style={tdStyle}>{formatDate(product.createdAt)}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Link
                        href={`/dashboard/products/${product.id}`}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '6px',
                          color: 'var(--text-muted)',
                          backgroundColor: 'var(--bg-dark)',
                        }}
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '6px',
                          color: 'var(--primary)',
                          backgroundColor: 'var(--bg-dark)',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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