import RandomShape3 from '@/components/icons/shapes/RandomShape3';
import RandomShape4 from '@/components/icons/shapes/RandomShape4';
import StaticMenuBar from '@/components/menu-bar/StaticMenuBar';
import Footer from '@/components/footer/Footer';
import { getTranslations } from 'next-intl/server';

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('PrivacyPolicyPage');
  return (
    <div>
      <StaticMenuBar triggerCartCount={1} />
      <div className="max-w-7xl p-4 mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center mt-12 uppercase">
          {t('title')}
        </h1>
        <div
          className={
            'flex gap-2 justify-center items-center w-full flex-col md:flex-row mb-8'
          }
        >
          <div className="min-w-96 max-w-4xl w-full grow-1">
            <RandomShape3 />
          </div>
          <div className="max-w-lg w-full grow-1">
            <p>{t('paragraph1')}</p>
          </div>
        </div>
        <div
          className={
            'flex gap-2 justify-center items-center flex-col md:flex-row w-full'
          }
        >
          <div className="max-w-lg w-full grow-1 text-right">
            <p>{t('paragraph2')}</p>
          </div>
          <div className="min-w-96 max-w-4xl w-full grow-1">
            <RandomShape4 />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
