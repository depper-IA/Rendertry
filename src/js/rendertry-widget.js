/**
 * Rendertry Visualization Widget
 * Conecta el frontend estático con el backend de Rendertry
 * 
 * Uso: Incluye este script y llama RendertryWidget.init()
 */

const RendertryWidget = (function() {
  'use strict';

  // Estado del widget
  let state = {
    apiUrl: window.RENDERTRY_API_URL || 'https://api.rendertry.com',
    userId: null,
    brandId: null,
    selectedProduct: null,
    selfieFile: null,
    isGenerating: false
  };

  // Elementos del DOM (del index.html existente)
  const elements = {
    get uploadBox() { return document.querySelector('.upload-box'); },
    get rimItems() { return document.querySelectorAll('.rim-item-sm'); },
    get resultBox() { return document.querySelector('.result-box'); },
    get stepCards() { return document.querySelectorAll('.step-card'); }
  };

  /**
   * Inicializar el widget
   */
  function init(options = {}) {
    if (options.apiUrl) state.apiUrl = options.apiUrl;
    if (options.userId) state.userId = options.userId;
    if (options.brandId) state.brandId = options.brandId;

    setupUpload();
    setupProductSelection();
    
    console.log('[RendertryWidget] Inicializado:', state.apiUrl);
  }

  /**
   * Configurar upload de imagen
   */
  function setupUpload() {
    const uploadBox = elements.uploadBox;
    if (!uploadBox) return;

    // Crear input file oculto
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    uploadBox.appendChild(fileInput);

    // Botón de seleccionar imagen
    const uploadBtn = uploadBox.querySelector('.btn-sm');
    if (uploadBtn) {
      uploadBtn.addEventListener('click', () => fileInput.click());
    }

    // Drag & drop
    uploadBox.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadBox.classList.add('drag-over');
    });

    uploadBox.addEventListener('dragleave', () => {
      uploadBox.classList.remove('drag-over');
    });

    uploadBox.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadBox.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
      }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleImageUpload(file);
    });
  }

  /**
   * Manejar subida de imagen
   */
  async function handleImageUpload(file) {
    state.selfieFile = file;

    // Mostrar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.createElement('img');
      preview.src = e.target.result;
      preview.style.cssText = 'max-width:100%;max-height:200px;border-radius:8px;margin-top:10px;';
      
      const uploadBox = elements.uploadBox;
      const existingPreview = uploadBox.querySelector('.selfie-preview');
      if (existingPreview) existingPreview.remove();
      
      preview.classList.add('selfie-preview');
      uploadBox.appendChild(preview);
    };
    reader.readAsDataURL(file);

    // Auto-avanzar al paso 2 si hay imagen
    if (state.selectedProduct) {
      await generateVisualization();
    }
  }

  /**
   * Configurar selección de productos
   */
  function setupProductSelection() {
    const rimItems = elements.rimItems;
    
    rimItems.forEach(item => {
      item.addEventListener('click', async () => {
        // Remover selección anterior
        rimItems.forEach(rim => {
          rim.classList.remove('active');
          const check = rim.querySelector('.check-badge');
          if (check) check.remove();
        });

        // Seleccionar nuevo
        item.classList.add('active');
        const checkBadge = document.createElement('div');
        checkBadge.className = 'check-badge';
        checkBadge.innerHTML = '<i data-lucide="check" style="width:12px;height:12px;"></i>';
        item.appendChild(checkBadge);

        // Guardar producto seleccionado (desde data attributes)
        const img = item.querySelector('img');
        state.selectedProduct = {
          id: item.dataset.productId || img.alt,
          name: item.dataset.productName || img.alt,
          imageUrl: img.src,
          category: item.dataset.category || 'RIN'
        };

        // Auto-generar si ya hay imagen
        if (state.selfieFile) {
          await generateVisualization();
        }
      });
    });
  }

  /**
   * Generar visualización usando el endpoint público de pruebalo
   */
  async function generateVisualization() {
    if (state.isGenerating) return;
    if (!state.selfieFile) {
      alert('Por favor sube una imagen primero');
      return;
    }
    if (!state.selectedProduct) {
      alert('Por favor selecciona un producto');
      return;
    }

    state.isGenerating = true;
    showLoading(true);

    try {
      const brandSlug = state.brandId || 'default';

      // 1. Llamar al endpoint público de generación
      const generation = await createGenerationPublic(brandSlug);

      // 2. Esperar resultado (polling)
      const result = await waitForResultPublic(generation.id, brandSlug);

      // 3. Mostrar resultado
      showResult(result.result_image_url || result.resultUrl);
    } catch (error) {
      console.error('[RendertryWidget] Error:', error);
      showError('Error al generar visualización. Intenta de nuevo.');
    } finally {
      state.isGenerating = false;
      showLoading(false);
    }
  }

  /**
   * Convertir File a base64 data URL
   */
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Crear generación usando el endpoint público (sin auth)
   */
  async function createGenerationPublic(brandSlug) {
    const imageBase64 = await fileToBase64(state.selfieFile);

    const response = await fetch(`${state.apiUrl}/api/pruebalo/${brandSlug}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: imageBase64,
        productType: state.selectedProduct.category || 'RIN',
        productId: state.selectedProduct.id
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Error al crear generación');
    }

    return response.json();
  }

  /**
   * Esperar resultado con polling (endpoint público)
   */
  async function waitForResultPublic(generationId, brandSlug, maxAttempts = 60) {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`${state.apiUrl}/api/pruebalo/${brandSlug}/generation/${generationId}`);

      if (!response.ok) {
        await sleep(2000);
        continue;
      }

      const data = await response.json();

      if (data.status === 'SUCCESS' || data.status === 'success') {
        return data;
      }

      if (data.status === 'FAILED' || data.status === 'failed') {
        throw new Error(data.error_message || 'Generación fallida');
      }

      await sleep(3000);
    }

    throw new Error('Tiempo de espera agotado');
  }

  /**
   * Subir imagen (legacy - mantener por compatibilidad)
   */
  async function uploadSelfie() {
    const formData = new FormData();
    formData.append('file', state.selfieFile);

    const response = await fetch(`${state.apiUrl}/api/upload/selfie`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Error al subir imagen');
    }

    const data = await response.json();
    return data.url;
  }

  /**
   * Crear generación (legacy - mantener por compatibilidad)
   */
  async function createGeneration(selfieUrl) {
    const response = await fetch(`${state.apiUrl}/api/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        brand_id: state.brandId || 'default',
        product_id: state.selectedProduct.id,
        product_image_url: state.selectedProduct.imageUrl,
        selfie_url: selfieUrl,
        category: state.selectedProduct.category
      })
    });

    if (!response.ok) {
      throw new Error('Error al crear generación');
    }

    return response.json();
  }

  /**
   * Mostrar resultado
   */
  function showResult(imageUrl) {
    const resultBox = elements.resultBox;
    if (!resultBox) return;

    const resultImg = document.createElement('img');
    resultImg.src = imageUrl;
    resultImg.style.cssText = 'max-width:100%;max-height:300px;border-radius:8px;';
    resultImg.loading = 'lazy';

    // Limpiar resultado anterior
    const existingImg = resultBox.querySelector('img');
    if (existingImg) existingImg.remove();

    resultBox.appendChild(resultImg);

    // Agregar botón de descarga
    const downloadBtn = document.createElement('a');
    downloadBtn.href = imageUrl;
    downloadBtn.download = `rendertry-${state.selectedProduct.id}.png`;
    downloadBtn.className = 'btn-primary btn-sm';
    downloadBtn.style.cssText = 'margin-top:10px;display:inline-block;';
    downloadBtn.innerHTML = '<i data-lucide="download" style="width:14px;height:14px;"></i> Descargar';
    resultBox.appendChild(downloadBtn);

    // Reinicializar iconos
    if (window.lucide) window.lucide.createIcons();
  }

  /**
   * Mostrar/ocultar loading
   */
  function showLoading(show) {
    const resultBox = elements.resultBox;
    if (!resultBox) return;

    if (show) {
      resultBox.innerHTML = `
        <div class="loading-spinner">
          <i data-lucide="loader-2" style="width:32px;height:32px;animation:spin 1s linear infinite;"></i>
          <p>Generando visualización...</p>
        </div>
        <style>
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        </style>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  /**
   * Mostrar error
   */
  function showError(message) {
    const resultBox = elements.resultBox;
    if (!resultBox) return;

    resultBox.innerHTML = `
      <div class="error-message" style="color:#ef4444;text-align:center;">
        <i data-lucide="alert-circle" style="width:32px;height:32px;"></i>
        <p>${message}</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  /**
   * Obtener token de autenticación
   */
  function getAuthToken() {
    // Intentar obtener del localStorage
    return localStorage.getItem('rendertry_token') || '';
  }

  /**
   * Utilidades
   */
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * API pública
   */
  return {
    init,
    generate: generateVisualization,
    setApiUrl: (url) => { state.apiUrl = url; },
    setAuth: (userId, brandId) => {
      state.userId = userId;
      state.brandId = brandId;
    },
    getState: () => ({ ...state })
  };

})();

// Auto-inicializar si hay elementos del widget
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.upload-box') && document.querySelector('.rim-item-sm')) {
    RendertryWidget.init();
  }
});
