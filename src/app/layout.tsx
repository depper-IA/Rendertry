import type { Metadata } from 'next';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import ScrambleInit from '@/components/ScrambleInit';
import Preloader from '@/components/Preloader';

export const metadata: Metadata = {
  title: 'Rendertry — Visualizador de Personalización Automotriz',
  description:
    'Visualiza rines, pintura, wraps y accesorios en la foto de tu vehículo en segundos. Gratis. Sin registro.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Audiowide&family=Roboto:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/x-icon" href="/assets/logos/logo.ico" />
        {/* Runs before paint: if the preloader already played this session
            (effects loaded), hide it on every later load to avoid any flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('rt_preloaded')){document.documentElement.classList.add('skip-preloader');}}catch(e){}",
          }}
        />
      </head>
      <body>
        <Preloader />
        <SmoothScroll />
        <ScrambleInit />
        {children}
      </body>
    </html>
  );
}