import type { Metadata } from 'next';
import { JerseyFinder } from '@/components/soccer/JerseyFinder';

export const metadata: Metadata = {
  title: 'Soccer Jersey Price Finder',
  description: 'Find the cheapest soccer jerseys — authentic, replica, and fake — across every major retailer.',
};

export default function SoccerJerseysPage() {
  return <JerseyFinder />;
}
