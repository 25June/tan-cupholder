'use client';

import { ProductType } from '@/models/productType';
import {
  DeleteProductType,
  UpdateProductType
} from '@/app/admin/ui/product-types/buttons';

export default function ProductTypesTable({
  productTypes
}: {
  productTypes: ProductType[];
}) {
  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {productTypes?.map((productType) => (
                  <div
                    key={productType.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <p className="font-medium">{productType.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Short Name</p>
                        <p className="font-medium">{productType.short_name}</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Description</p>
                        <p className="font-medium truncate">
                          {productType.description || 'No description'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Short Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Description
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {productTypes?.map((productType) => (
                    <tr key={productType.id} className="group bg-white">
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p className="font-medium">{productType.name}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        {productType.short_name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-sm max-w-xs">
                        <div className="truncate">
                          {productType.description || 'No description'}
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateProductType id={productType.id} />
                          <DeleteProductType id={productType.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
