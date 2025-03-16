const mockData = [
  {
    id: '1',
    title: 'Question 1',
    answer: 'Answer 1',
  },
  {
    id: '2',
    title: 'Question 2',
    answer: 'Answer 2',
  },
  {
    id: '3',
    title: 'Question 3',
    answer: 'Answer 3',
  },
  {
    id: '4',
    title: 'Question 4',
    answer: 'Answer 4',
  },
  {
    id: '5',
    title: 'Question 5',
    answer: 'Answer 5',
  },
];

export const Faq = () => {
  return (
    <div className="relative max-w-6xl mx-auto grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full row-start-2">
        <h3 className="text-center font-bold text-1xl text-slate-500 tracking-wide">
          FAQ
        </h3>
        <h4 className="text-center font-semibold text-4xl">
          Question? Look here
        </h4>
        <div className="mt-8 space-y-4">
          {mockData.map((item) => {
            return (
              <div
                key={item.id}
                className="p-4 flex justify-between justify-items-center border-logo-orange-border border-2 rounded-md border-solid "
              >
                <p className="font-semibold">{item.title}</p>
                <button>Expand</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
