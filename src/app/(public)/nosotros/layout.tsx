import type { Metadata } from 'next';

const title = 'Nosotros';
const description =
  'Conoce a Rendertry: el equipo detrás del visualizador con IA que te deja probar rines, pintura y wraps sobre la foto de tu vehículo antes de invertir.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/nosotros' },
  openGraph: {
    title: `${title} | Rendertry`,
    description,
    url: '/nosotros',
  },
};

export default function NosotrosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
