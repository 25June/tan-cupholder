import { getTranslations } from 'next-intl/server';

export default async function PaymentPage() {
  const t = await getTranslations('PaymentPage');

  return <div>PaymentPage</div>;
}
