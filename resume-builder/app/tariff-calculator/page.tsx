import type { Metadata } from 'next';
import { TariffCalculator } from '@/components/tariff/TariffCalculator';

export const metadata: Metadata = {
  title: 'Tariff Impact Calculator',
  description: 'Estimate US import duties by HTS code and country of origin.',
};

export default function TariffCalculatorPage() {
  return <TariffCalculator />;
}
