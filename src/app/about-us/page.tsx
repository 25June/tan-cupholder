import AvatarShape1 from '@/components/icons/shapes/AvatarShape1';
import AvatarShape2 from '@/components/icons/shapes/AvatarShape2';
import AvatarShape3 from '@/components/icons/shapes/AvatarShape3';
import StaticMenuBar from '@/components/menu-bar/StaticMenuBar';
import Footer from '@/components/footer/Footer';
import { getTranslations } from 'next-intl/server';

export default async function AboutUsPage() {
  const t = await getTranslations('AboutUsPage');
  const founders = [
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      bio: 'John is a passionate environmentalist and entrepreneur who founded TaN to create sustainable products that make a difference. With a background in textile engineering, he is dedicated to innovating materials that are both durable and eco-friendly.',
      avatar: <AvatarShape1 />
    },
    {
      name: 'Jane Smith',
      role: 'Co-Founder & Designer',
      bio: "Jane is a creative designer with a love for nature. She believes in the power of design to inspire change and has played a key role in developing TaN's unique product line that combines style with sustainability.",
      avatar: <AvatarShape2 />
    },
    {
      name: 'Emily Johnson',
      role: 'Sustainability Expert',
      bio: "Emily is a sustainability advocate with years of experience in environmental conservation. She ensures that TaN's practices align with our commitment to protecting the planet, from sourcing materials to production processes.",
      avatar: <AvatarShape3 />
    }
  ];
  return (
    <div>
      <StaticMenuBar triggerCartCount={1} />
      <div className="max-w-7xl p-4 mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center mt-12 uppercase">
          {t('title')}
        </h1>
        <div className="flex gap-2 justify-center items-center w-full flex-col md:flex-row mb-8">
          {founders.map((founder, index) => (
            <div
              key={index}
              className={
                'flex gap-2 justify-center items-center w-full flex-col mb-8'
              }
            >
              <div className="min-w-96 max-w-4xl w-full grow-1">
                {founder.avatar}
              </div>
              <div className="max-w-lg w-full grow-1 px-2">
                <h5 className="text-2xl font-bold mb-2">{founder.name}</h5>
                <p className="mb-4">{founder.role}</p>
                <p className="text-gray-400">{founder.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
