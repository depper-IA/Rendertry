import WidgetClient from './WidgetClient';

interface WidgetProps {
  brandSlug: string;
}

export default function Widget({ brandSlug }: WidgetProps) {
  return <WidgetClient brandSlug={brandSlug} />;
}