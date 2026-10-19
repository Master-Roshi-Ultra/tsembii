import { LegalPage, legalMetadata } from '@/components/layout/LegalPage';

export const generateMetadata = () => legalMetadata('terms');

export default function TermsPage() {
  return <LegalPage page="terms" />;
}
