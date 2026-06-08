import type { Metadata } from 'next';

const title = 'Contacto';
const description =
  'Habla con el equipo de Rendertry. Resuelve dudas sobre la plataforma de personalización vehicular con IA o solicita una demo para tu taller o negocio.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/contacto' },
  openGraph: {
    title: `${title} | Rendertry`,
    description,
    url: '/contacto',
  },
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
