'use client';

import { useState } from 'react';
import { Menu, ChevronDown, Zap, Palette, Disc, Layers, X } from 'lucide-react';

interface NavbarProps {
  activePage?: 'plataforma' | 'nosotros' | 'contacto' | '';
}

export default function Navbar({ activePage = '' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setActiveMegaMenu(null);
  };

  const toggleMegaMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveMegaMenu(activeMegaMenu === 'plataforma' ? null : 'plataforma');
  };

  return (
    <div className="navbar-wrapper">
      {mobileMenuOpen && <div className="nav-overlay" onClick={toggleMobileMenu} />}
      <nav className="site-nav" id="navbar">
        <div className="container nav-inner">
          <a href="/" className="logo">
            <img src="/assets/logos/logo.png" alt="Rendertry Logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            <span className="logo-text">
              <span className="logo-render">RENDER</span>
              <span className="logo-try">TRY</span>
            </span>
          </a>

          <button className="menu-toggle" id="menuToggle" aria-label="Abrir menú" aria-expanded={mobileMenuOpen} onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <ul className="nav-links" id="navLinks">
            <li className={`has-mega${activeMegaMenu === 'plataforma' ? ' mobile-expanded' : ''}`}>
              <a href="/" onClick={toggleMegaMenu}>
                <span data-scramble>Plataforma</span>
                <ChevronDown size={14} className={`nav-chevron${activeMegaMenu === 'plataforma' ? ' expanded' : ''}`} />
              </a>
            <div className="mega-menu">
              <a href="/#proceso" className="mega-item">
                <div className="mega-icon"><Zap size={18} /></div>
                <div>
                  <span className="mega-text-title">Cómo funciona</span>
                  <span className="mega-text-desc">Sube tu imagen, elige el producto y visualiza el resultado en segundos.</span>
                </div>
              </a>
              <a href="/#funcionalidades" className="mega-item">
                <div className="mega-icon"><Palette size={18} /></div>
                <div>
                  <span className="mega-text-title">Funcionalidades</span>
                  <span className="mega-text-desc">Rines, wraps, pintura, accesorios y más para personalizar tu vehículo.</span>
                </div>
              </a>
              <a href="/#galeria" className="mega-item">
                <div className="mega-icon"><Disc size={18} /></div>
                <div>
                  <span className="mega-text-title">Galería</span>
                  <span className="mega-text-desc">Inspírate con los diseños más innovadores de la comunidad.</span>
                </div>
              </a>
              <a href="/#precios" className="mega-item">
                <div className="mega-icon"><Layers size={18} /></div>
                <div>
                  <span className="mega-text-title">Planes y precios</span>
                  <span className="mega-text-desc">Desde gratis hasta Business. Elige el plan que mejor se adapte a ti.</span>
                </div>
              </a>
            </div>
          </li>
          <li>
            <a href="/nosotros" className={activePage === 'nosotros' ? 'active' : ''} data-scramble>Nosotros</a>
          </li>
          <li>
            <a href="/contacto" className={activePage === 'contacto' ? 'active' : ''} data-scramble>Contacto</a>
          </li>
        </ul>
        <a href="/demo" className="btn-primary d-none d-md-inline-flex" data-scramble>Probar gratis</a>
        </div>
      </nav>
    </div>
  );
}
