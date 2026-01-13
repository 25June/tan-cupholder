import ProductDetailSkeleton from '@/components/skeleton/ProductDetail.skeleton';
import Footer from '@/components/footer/Footer';

// Loading skeleton for the entire product page - displayed during initial load
export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Menu bar skeleton */}
      <div className="h-16 bg-gray-100 animate-pulse" />

      <main className="relative h-full flex flex-col justify-between mt-4 md:mt-24 p-4">
        {/* Breadcrumb skeleton */}
        <nav className="w-full max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            <span className="text-gray-300">/</span>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <span className="text-gray-300">/</span>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </nav>

        {/* Product detail skeleton */}
        <ProductDetailSkeleton />

        {/* Article section skeleton */}
        <article className="mt-8 md:mt-24">
          <section className="max-w-4xl mx-auto space-y-12 px-6 mb-16">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            </div>

            {/* Shape placeholders */}
            <div className="flex flex-row gap-4 justify-center w-full h-full">
              {[1, 2, 3].map((num) => (
                <div
                  key={`shape-skeleton-${num}`}
                  className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"
                />
              ))}
            </div>

            <div className="border-l-4 border-gray-200 pl-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          </section>

          {/* Related products skeleton */}
          <section className="mx-auto space-y-12 px-4">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto animate-pulse" />
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
        </article>
      </main>

      <div className="mt-8 md:mt-24">
        <Footer />
      </div>
    </div>
  );
}
