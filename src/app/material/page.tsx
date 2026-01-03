import RandomShape3 from '@/components/icons/shapes/RandomShape3';
import RandomShape4 from '@/components/icons/shapes/RandomShape4';
import { getTranslations } from 'next-intl/server';
import CDNImage from '@/components/cdn-image/CDNImage';

export default async function MaterialPage() {
  const t = await getTranslations('MaterialPage');

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

      {/* Featured image */}
      <figure className="w-full max-w-[1440px] mx-auto my-4 relative aspect-video rounded-xl overflow-hidden border-6 border-logo-orange-border">
        <CDNImage
          src="https://pub-485637738840450490e408cee2acb72c.r2.dev/feature-images/IMG_7414.jpg"
          alt="hero-image-1"
          width={1600}
          height={900}
          className="w-full h-full object-cover"
          priority
        />
      </figure>

      {/* Second content block - text left, shape right */}
      <article className="flex gap-2 justify-center items-center flex-col md:flex-row w-full">
        <div className="max-w-lg w-full grow text-right">
          <p>{t('paragraph2')}</p>
        </div>
        <figure className="min-w-96 max-w-4xl w-full grow">
          <RandomShape4 />
        </figure>
      </article>
    </section>
  );
}
