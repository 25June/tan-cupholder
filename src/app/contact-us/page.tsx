import RandomShape3 from '@/components/icons/shapes/RandomShape3';
import RandomShape5 from '@/components/icons/shapes/RandomShape5';
import { getTranslations } from 'next-intl/server';

export default async function ContactUsPage() {
  const t = await getTranslations('ContactUsPage');

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4 text-center mt-12 uppercase">
        {t('title')}
      </h1>

      {/* First content block - shape left, text right */}
      <article className="flex gap-2 justify-center items-center w-full flex-col md:flex-row mb-8">
        <figure className="min-w-96 max-w-4xl w-full grow">
          <RandomShape3 />
        </figure>
        <div className="max-w-lg w-full grow">
          <p>{t('paragraph1')}</p>
        </div>
      </article>

      {/* Second content block - text left, shape right */}
      <article className="flex gap-2 justify-center items-center flex-col md:flex-row w-full">
        <div className="max-w-lg w-full grow text-right">
          <p>{t('paragraph2')}</p>
        </div>
        <figure className="min-w-96 max-w-4xl w-full grow">
          <RandomShape5 />
        </figure>
      </article>
    </section>
  );
}
