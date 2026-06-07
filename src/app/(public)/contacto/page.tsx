'use client';

import { MapPin, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactoPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Solicitud enviada. Te contactamos pronto.');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-main)', minHeight: '100vh' }}>
      <Navbar activePage="contacto" />

      <main className="contact-hero">
        <div className="container">
          <div className="contact-container">
            
            {/* Info Section */}
            <div className="contact-info">
              <h1>
                Agenda tu <span style={{ color: 'var(--primary)' }}>Proyecto</span>
              </h1>
              <p>
                Transformamos visiones en máquinas de alto rendimiento. Ponte en contacto con nuestro equipo técnico para
                una asesoría personalizada.
              </p>

              <div className="info-item">
                <div className="info-icon">
                  <MapPin size={22} />
                </div>
                <div className="info-text">
                  <h4>Ubicación</h4>
                  <p>Cali - Colombia</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Phone size={22} />
                </div>
                <div className="info-text">
                  <h4>Teléfono Directo</h4>
                  <p>+57 3105436281</p>
                </div>
              </div>

              <div className="footer-social" style={{ marginTop: '2rem', justifyContent: 'flex-start' }}>
                <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                </a>
                <a href="https://x.com" aria-label="Twitter" target="_blank" rel="noopener">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16H20L8.267 4H4z" /><path d="M4 20l6.768-6.768M20 4l-6.768 6.768" /></svg>
                </a>
                <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noopener">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>
                </a>
              </div>
            </div>

            {/* Form Section */}
            <div className="contact-form-wrapper">
              <form id="contactForm" onSubmit={handleSubmit} className="contact-form-premium">
                <div className="form-group">
                  <label>Tu Nombre</label>
                  <input type="text" placeholder="Ej: Marcos Pérez" required />
                </div>

                <div className="form-group">
                  <label>Email de Contacto</label>
                  <input type="email" placeholder="marcos@ejemplo.com" required />
                </div>

                <div className="form-group">
                  <label>Tipo de Servicio</label>
                  <select defaultValue="Visualización de Rines">
                    <option>Visualización de Rines</option>
                    <option>Cambio de Pintura / Wrap</option>
                    <option>Accesorios Aerodinámicos</option>
                    <option>Proyecto Completo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Cuéntanos tu idea</label>
                  <textarea rows={4} placeholder="¿Qué tienes en mente para tu auto?"></textarea>
                </div>

                <button type="submit" className="btn-primary btn-block btn-lg" data-scramble>Enviar Solicitud de Asesoría</button>
              </form>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}