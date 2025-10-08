import { lusitana } from '@/app/admin/ui/fonts';

export default function Loading() {
  return (
    <main>
      <div className="flex w-full items-center justify-between mb-8">
        <h1 className={`${lusitana.className} text-xl md:text-2xl`}>
          Orders Management
        </h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* Search skeleton */}
        <div className="relative flex flex-1 flex-shrink-0">
          <div className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 bg-gray-200 animate-pulse"></div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="mb-2 w-full rounded-md bg-gray-200 p-4 animate-pulse"
                    >
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    {Array(8)
                      .fill(0)
                      .map((_, i) => (
                        <th key={i} className="px-3 py-5">
                          <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Array(10)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i} className="bg-white">
                        {Array(8)
                          .fill(0)
                          .map((_, j) => (
                            <td key={j} className="px-3 py-5">
                              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                          ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="mt-5 flex w-full justify-center">
        <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
      </div>
    </main>
  );
}
