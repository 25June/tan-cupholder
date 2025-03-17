import Image from 'next/image';

const mockData = [
  {
    id: '1',
    name: 'Product 1',
    price: 89900,
    sale: 20,
    type: 'Type 1',
    image: '/IMG_7210.jpg',
  },
  {
    id: '2',
    name: 'Product 2',
    price: 89900,
    sale: 20,
    type: 'Type 1',
    image: '/IMG_7281.jpg',
  },
  {
    id: '3',
    name: 'Product 3',
    price: 89900,
    sale: 20,
    type: 'Type 1',
    image: '/IMG_7341.jpg',
  },
  {
    id: '4',
    name: 'Product 4',
    price: 89900,
    sale: 20,
    type: 'Type 1',
    image: '/IMG_7210.jpg',
  },
];

export const ProductSlider = () => {
  const numberWithCommas = (x: number) => {
    const parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
  };

  const calculatePercent = (price: number, percent: number) => {
    const actualPrice = price - (price / 100) * percent;
    const ceilingNumber = Math.ceil(actualPrice);
    return numberWithCommas(ceilingNumber);
  };
  return (
    <div className="relative">
      <div className="relative z-20 max-w-8xl mx-auto grid grid-rows-[20px_1fr_20px] items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="w-full gap-8 row-start-2 text-center">
          <h2 className="text-lg antialiased text-slate-400 ">Our Products</h2>
          <h3 className="text-3xl antialiased text-logo-orange font-bold tracking-wide mb-4 ">
            Our Products Collections
          </h3>
          <div className="flex gap-8 justify-center mb-10">
            <button
              type="button"
              className="text-lg tracking-wide text-logo-orange hover:text-slate-100 rounded-full transition-all duration-300 border-logo-orange border-2 hover:bg-logo-orange py-1 px-4"
            >
              All Product
            </button>
            <button
              type="button"
              className="text-lg tracking-wide text-logo-orange hover:text-slate-100 rounded-full transition-all duration-300 border-logo-orange border-2 hover:bg-logo-orange py-1 px-4"
            >
              Latest Products
            </button>
            <button
              type="button"
              className="text-lg tracking-wide text-logo-orange hover:text-slate-100 rounded-full transition-all duration-300 border-logo-orange border-2 hover:bg-logo-orange py-1 px-4"
            >
              Best Seller
            </button>
            <button
              type="button"
              className="text-lg tracking-wide text-logo-orange hover:text-slate-100 rounded-full transition-all duration-300 border-logo-orange border-2 hover:bg-logo-orange py-1 px-4"
            >
              Featured Products
            </button>
          </div>
          <div>
            <div className="relative grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 py-2 px-2">
              {mockData.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="relative justify-self-center shadow-md hover:shadow-2xl transition-shadow duration-300 rounded-xl w-auto"
                  >
                    <div className="relative bg-black rounded-xl overflow-hidden outline outline-2 -outline-offset-8 outline-slate-100 transition-all duration-300 ">
                      <div className="z-10 absolute text-xs font-semibold top-4 left-4 text-slate-100 rounded-full bg-logo-orange py-1 px-2">
                        {item.sale}%
                      </div>
                      <Image
                        src={item.image}
                        width={300}
                        height={300}
                        alt={item.image}
                        className="w-72 h-72 min-w-72 hover:scale-110 transform-none transition-all duration-300"
                      />
                    </div>
                    <div className="relative text-left p-2">
                      <div className="text-sm font-light text-slate-500">
                        {item.type}
                      </div>
                      <h4 className="text-lg font-semibold">{item.name}</h4>
                      <div>
                        <span className="text-slate-400 line-through decoration-slate-400">
                          {numberWithCommas(item.price)} vnd
                        </span>
                        {' -> '}
                        <span className="font-medium">
                          {calculatePercent(item.price, item.sale)} vnd
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
      <div className="absolute top-0 w-screen">
        <Image
          src={'/top-wave.svg'}
          width={160}
          height={90}
          alt="wave"
          className="w-screen"
        />
      </div>
    </div>
  );
};
