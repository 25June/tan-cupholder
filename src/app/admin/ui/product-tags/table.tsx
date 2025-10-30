'use client';

import { useState } from 'react';
import { ProductTag } from '@/models/productTag';
import {
  DeleteProductTag,
  UpdateProductTag
} from '@/app/admin/ui/product-tags/buttons';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function ProductTagsTable({
  productTags
}: {
  productTags: ProductTag[];
}) {
  const [doubleClick, setDoubleClick] = useState<Record<string, boolean>>({});

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {productTags?.map((tag) => (
                  <div
                    key={tag.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <p className="font-medium">{tag.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/3 flex-col">
                        <p className="text-xs">Short Name</p>
                        <p className="font-medium">{tag.short_name}</p>
                      </div>
                      <div className="flex w-1/3 flex-col">
                        <p className="text-xs">Color</p>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {tag.color || '-'}
                          </span>
                          {tag.color ? (
                            <span
                              className="inline-block w-4 h-4 rounded"
                              style={{ backgroundColor: tag.color }}
                            />
                          ) : null}
                        </div>
                      </div>
                      <div className="flex w-1/3 flex-col">
                        <p className="text-xs">Description</p>
                        <p className="font-medium truncate">
                          {tag.description || 'No description'}
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
                      Color
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
                  {productTags?.map((tag) => (
                    <tr key={tag.id} className="group bg-white">
                      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p className="font-medium">{tag.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        {tag.short_name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-sm">
                        <div className="flex items-center gap-2">
                          <span>{tag.color || '-'}</span>
                          {tag.color ? (
                            <span
                              className="inline-block w-4 h-4 rounded"
                              style={{ backgroundColor: tag.color }}
                            />
                          ) : null}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-5 text-sm max-w-xs">
                        <div className="truncate">
                          {tag.description || 'No description'}
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateProductTag id={tag.id} />
                          {doubleClick[tag.id] ? (
                            <DeleteProductTag id={tag.id} />
                          ) : (
                            <button
                              onClick={() =>
                                setDoubleClick((prev) => ({
                                  ...prev,
                                  [tag.id]: true
                                }))
                              }
                              className="rounded-md border p-2 hover:bg-gray-100"
                            >
                              <span className="sr-only">Delete</span>
                              <TrashIcon className="w-5" />
                            </button>
                          )}
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
