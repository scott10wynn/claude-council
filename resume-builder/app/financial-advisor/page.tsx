import type { Metadata } from 'next';
import { FinancialAdvisor } from '@/components/financial-advisor/FinancialAdvisor';

export const metadata: Metadata = {
  title: 'Financial Advisor — Personal Finance & Tax Guidance',
  description: 'AI-powered financial advisor for budgeting, investing, retirement, and tax questions.',
};

export default function FinancialAdvisorPage() {
  return <FinancialAdvisor />;
}
