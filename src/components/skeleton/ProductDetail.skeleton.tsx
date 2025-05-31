export default function ProductDetailSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto flex gap-12 flex-col md:flex-row">
      <div className="flex flex-1 gap-4 flex-col-reverse md:flex-row">
        <div className="flex-1 hidden md:flex flex-row md:flex-col gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="min-w-12 md:min-w-24 rounded-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
            >
              <div className="skeleton w-12 md:w-24 h-12 md:h-24"></div>
            </div>
          ))}
        </div>
        <div className="w-full">
          <div className="skeleton w-full h-[500px]"></div>
        </div>
      </div>
      <div className="flex-1 mt-4 flex flex-col gap-4 justify-between">
        <div>
          <h1 className="text-5xl font-bold mb-4">
            <div className="skeleton w-full h-[48px]"></div>
          </h1>
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-3xl font-bold w-full text-slate-400 ">
              <div className="skeleton w-full h-[36px]"></div>
            </h3>
            <h5 className="text-slate-400 w-full line-through decoration-slate-400">
              <div className="skeleton w-full h-[24px]"></div>
            </h5>
          </div>
          <div className="mb-4">
            <div className="skeleton w-full h-[12px] mb-2"></div>
            <div className="skeleton w-full h-[12px] mb-2"></div>
            <div className="skeleton w-full h-[12px] mb-2"></div>
            <div className="skeleton w-full h-[12px] mb-2"></div>
          </div>
        </div>
        <div>
          <div className="w-full">
            <div className="skeleton w-full h-[40px] mb-2"></div>
            <div className="skeleton w-full h-[40px] mb-2"></div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="skeleton w-full h-[40px]"></div>
            <div className="skeleton w-full h-[40px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
