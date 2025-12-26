// Skeleton for Related Products section while streaming
export default function RelatedProductsSkeleton() {
  return (
    <section className="mx-auto space-y-12 px-4">
      <h2 className="text-2xl font-bold mb-2 text-center text-logo-orange-border">
        Related Products
      </h2>
      <div className="flex flex-row overflow-hidden gap-8 py-4 px-2 mx-auto max-w-[90vw] lg:max-w-[1024px] justify-center">
        {[1, 2, 3].map((num) => (
          <div
            key={`related-skeleton-${num}`}
            className="w-64 h-80 bg-gray-100 rounded-lg animate-pulse shrink-0"
          >
            <div className="w-full h-48 bg-gray-200 rounded-t-lg" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
