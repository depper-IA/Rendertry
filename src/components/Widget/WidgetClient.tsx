'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

type ProductType = 'RIN' | 'WRAP' | 'PAINT';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  category: ProductType;
  price?: number | null;
  badge?: string | null;
}

interface WidgetClientProps {
  brandSlug: string;
}

const MOCK_PRODUCTS: Record<ProductType, Product[]> = {
  RIN: [
    { id: 'rin-1', name: 'BBS E88', imageUrl: '/wheelblend/BBS-E88.png', category: 'RIN', badge: 'top' },
    { id: 'rin-2', name: 'HRE HX101', imageUrl: '/wheelblend/HRE-HX101.png', category: 'RIN', badge: 'nuevo' },
    { id: 'rin-3', name: 'ADVAN GT', imageUrl: '/wheelblend/ADVAN-GT.png', category: 'RIN' },
    { id: 'rin-4', name: 'ENKEI RPF1', imageUrl: '/wheelblend/ENKEI-RPF1-SILVER.png', category: 'RIN', badge: 'oferta' },
    { id: 'rin-5', name: 'Volk TE37', imageUrl: '/wheelblend/VOLK-TE37-BRONZE.png', category: 'RIN' },
    { id: 'rin-6', name: 'BBS SX', imageUrl: '/wheelblend/BBS-SX-BRILLIANT-SILVER.png', category: 'RIN' },
    { id: 'rin-7', name: 'SSR GTV03', imageUrl: '/wheelblend/SSR-GTV03-SILVER.png', category: 'RIN' },
    { id: 'rin-8', name: 'Weld S71', imageUrl: '/wheelblend/WELD-S71.png', category: 'RIN' },
  ],
  WRAP: [
    { id: 'wrap-1', name: 'Satin Negro', imageUrl: '/assets/wraps/wrap-satin-black.webp', category: 'WRAP', badge: 'top' },
    { id: 'wrap-2', name: 'Gloss Silver', imageUrl: '/assets/wraps/wrap-gloss-silver.webp', category: 'WRAP' },
    { id: 'wrap-3', name: 'Gloss Negro Carbono', imageUrl: '/assets/wraps/wrap-gloss-black-carbon.webp', category: 'WRAP', badge: 'nuevo' },
    { id: 'wrap-4', name: 'Satin Blanco', imageUrl: '/assets/wraps/wrap-satin-white.webp', category: 'WRAP' },
    { id: 'wrap-5', name: 'Matte Red', imageUrl: '/assets/wraps/wrap-matte-red.webp', category: 'WRAP' },
    { id: 'wrap-6', name: 'Gloss Orange', imageUrl: '/assets/wraps/wrap-gloss-orange.webp', category: 'WRAP' },
    { id: 'wrap-7', name: 'Satin Blue', imageUrl: '/assets/wraps/wrap-satin-blue.webp', category: 'WRAP' },
    { id: 'wrap-8', name: 'Chrome Gold', imageUrl: '/assets/wraps/wrap-chrome-gold.webp', category: 'WRAP' },
  ],
  PAINT: [
    { id: 'paint-1', name: 'Racing Red', imageUrl: '/assets/wraps/wrap-matte-red.webp', category: 'PAINT', badge: 'top' },
    { id: 'paint-2', name: 'Midnight Black', imageUrl: '/assets/wraps/wrap-satin-black.webp', category: 'PAINT' },
    { id: 'paint-3', name: 'Pearl White', imageUrl: '/assets/wraps/wrap-satin-white.webp', category: 'PAINT', badge: 'oferta' },
    { id: 'paint-4', name: 'Chrome Gold', imageUrl: '/assets/wraps/wrap-chrome-gold.webp', category: 'PAINT' },
  ],
};

export default function WidgetClient({ brandSlug }: WidgetClientProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [productType, setProductType] = useState<ProductType>('RIN');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      if (brandSlug === 'demo-brand') {
        setProducts(MOCK_PRODUCTS[productType]);
        setIsLoadingProducts(false);
        return;
      }
      try {
        const response = await fetch(`/api/products?category=${productType}`);
        if (response.ok) {
          const data = await response.json();
          const loadedProducts = data.products || [];
          if (loadedProducts.length > 0) {
            setProducts(loadedProducts);
          } else {
            setProducts(MOCK_PRODUCTS[productType]);
          }
        } else {
          setProducts(MOCK_PRODUCTS[productType]);
        }
      } catch {
        setProducts(MOCK_PRODUCTS[productType]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [productType, brandSlug]);

  const handleImageSelect = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setSelectedImage(base64);
      setResultImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSelect(file);
    }
  }, [handleImageSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  }, [handleImageSelect]);

  const pollGenerationStatus = useCallback(async (generationId: string): Promise<string | null> => {
    const maxAttempts = 30;
    let attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));

      try {
        const response = await fetch(`/api/pruebalo/${brandSlug}/generation/${generationId}`);
        const data = await response.json();

        if (data.status === 'completed' && data.resultUrl) {
          return data.resultUrl;
        }

        if (data.status === 'failed') {
          throw new Error(data.error || 'Generation failed');
        }
      } catch (err) {
        console.error('Polling error:', err);
        // Bubble the error up to break the polling loop and show it in the UI immediately
        throw err;
      }

      attempts++;
    }

    throw new Error('Generation timed out');
  }, [brandSlug]);

  const handleGenerate = useCallback(async () => {
    if (!selectedImage || !selectedProduct) {
      setError('Please select an image and a product');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResultImage(null);

    try {
      const generateResponse = await fetch(`/api/pruebalo/${brandSlug}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: selectedImage,
          productType,
          productId: selectedProduct.id,
        }),
      });

      const generateData = await generateResponse.json();

      if (!generateResponse.ok) {
        throw new Error(generateData.error || 'Failed to start generation');
      }

      const resultUrl = await pollGenerationStatus(generateData.generationId);
      setResultImage(resultUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedImage, selectedProduct, productType, brandSlug, pollGenerationStatus]);

  return (
    <div className="widget-container">
      <div className="upload-section">
        <h3>1. Sube tu foto</h3>
        <div
          className={`drop-zone ${isDragging ? 'dragging' : ''} ${selectedImage ? 'has-image' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {selectedImage ? (
            <img src={selectedImage} alt="Selected" className="preview-image" />
          ) : (
            <div className="drop-content">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17,8 12,3 7,8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p>Arrastra una imagen o haz clic para seleccionar</p>
              <span>JPG, PNG hasta 10MB</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div className="products-section">
        <h3>2. Selecciona categoría</h3>
        <div className="category-tabs">
          {(['RIN', 'WRAP', 'PAINT'] as ProductType[]).map((type) => (
            <button
              key={type}
              className={`tab ${productType === type ? 'active' : ''}`}
              onClick={() => {
                setProductType(type);
                setSelectedProduct(null);
                setResultImage(null);
              }}
            >
              {type === 'RIN' && 'Rines'}
              {type === 'WRAP' && 'Wraps'}
              {type === 'PAINT' && 'Pintura'}
            </button>
          ))}
        </div>

        <h4>Productos disponibles</h4>
        <div className="products-grid">
          {isLoadingProducts ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="product-card skeleton">
                  <div className="product-image skeleton-image" />
                  <p className="product-name skeleton-text" />
                </div>
              ))}
            </>
          ) : products.length === 0 ? (
            <p className="no-products">No hay productos disponibles</p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className={`product-card ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedProduct(product);
                  setResultImage(null);
                }}
              >
                <div className="product-image">
                  <img src={product.imageUrl} alt={product.name} />
                </div>
                <p className="product-name">{product.name}</p>
                {product.badge && (
                  <span className={`badge badge-${product.badge}`}>{product.badge}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="actions-section">
        <button
          className="btn-primary btn-block btn-lg"
          onClick={handleGenerate}
          disabled={!selectedImage || !selectedProduct || isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="spinner"></span>
              Generando...
            </>
          ) : (
            'Generar Visualización'
          )}
        </button>

        {error && (
          <div className="error-message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}
      </div>

      {resultImage && (
        <div className="result-section">
          <h3>Resultado</h3>
          <div className="result-container">
            <img src={resultImage} alt="Generated result" />
          </div>
        </div>
      )}

      <style jsx>{`
        .widget-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        h3 {
          font-family: var(--font-display);
          font-size: 1.25rem;
          margin-bottom: 1rem;
          color: var(--text-main);
        }

        h4 {
          font-size: 1rem;
          color: var(--text-muted);
          margin: 1rem 0 0.75rem;
        }

        .drop-zone {
          border: 2px dashed var(--border-color);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          cursor: crosshair;
          transition: all 0.2s;
          background: var(--bg-card);
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drop-zone:hover,
        .drop-zone.dragging {
          border-color: var(--primary);
          background: rgba(230, 57, 70, 0.05);
        }

        .drop-zone.has-image {
          padding: 1rem;
        }

        .drop-content {
          color: var(--text-muted);
        }

        .drop-content svg {
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .drop-content p {
          margin-bottom: 0.5rem;
        }

        .drop-content span {
          font-size: 0.875rem;
          opacity: 0.7;
        }

        .preview-image {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          object-fit: contain;
        }

        .category-tabs {
          display: flex;
          gap: 0.5rem;
        }

        .tab {
          padding: 0.75rem 1.5rem;
          border: 1px solid var(--border-color);
          background: transparent;
          color: var(--text-muted);
          border-radius: 8px;
          cursor: crosshair;
          font-weight: 500;
          transition: all 0.2s;
        }

        .tab:hover {
          border-color: var(--primary);
          color: var(--text-main);
        }

        .tab.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 1rem;
        }

        .product-card {
          background: var(--bg-card);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 1rem;
          cursor: crosshair;
          transition: all 0.2s;
          position: relative;
        }

        .product-card:hover {
          border-color: var(--primary);
          background: var(--bg-card-hover);
        }

        .product-card.selected {
          border-color: var(--primary);
          background: rgba(230, 57, 70, 0.1);
        }

        .product-image {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 0.75rem;
          background: var(--bg-dark);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }

        .product-name {
          font-size: 0.875rem;
          color: var(--text-main);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .badge-top {
          background: var(--primary);
          color: white;
        }

        .badge-nuevo {
          background: var(--secondary);
          color: var(--bg-dark);
        }

        .badge-oferta {
          background: #22c55e;
          color: white;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--primary);
          border-radius: 8px;
          color: var(--primary);
          font-size: 0.875rem;
          margin-top: 1rem;
        }

        .result-section {
          margin-top: 1rem;
        }

        .result-container {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .result-container img {
          width: 100%;
          display: block;
        }

        .product-card.skeleton {
          pointer-events: none;
        }

        .skeleton-image {
          background: linear-gradient(90deg, var(--bg-dark) 25%, var(--border-color) 50%, var(--bg-dark) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-text {
          height: 1rem;
          width: 80%;
          background: linear-gradient(90deg, var(--bg-dark) 25%, var(--border-color) 50%, var(--bg-dark) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .no-products {
          grid-column: 1 / -1;
          text-align: center;
          color: var(--text-muted);
          padding: 2rem;
        }
      `}</style>
    </div>
  );
}