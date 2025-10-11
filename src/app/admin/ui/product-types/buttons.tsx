import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteProductType } from '@/app/admin/lib/actions/product-types.actions';

export function CreateProductType() {
  return (
    <Link
      href="/admin/dashboard/product-types/create"
      prefetch={true}
      className="flex h-10 items-center rounded-lg bg-logo-orange-border px-4 text-sm font-medium text-white transition-colors hover:bg-logo-orange-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-orange-border"
    >
      <span className="hidden md:block">Create Product Type</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateProductType({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/dashboard/product-types/${id}/edit`}
      prefetch={true}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteProductType({ id }: { id: string }) {
  const handleDeleteProductType = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    await deleteProductType(id);
  };

  return (
    <form onSubmit={handleDeleteProductType}>
      <button
        type="submit"
        className="rounded-md border border-red-400 p-2 bg-gray-100"
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5 text-red-500" />
      </button>
    </form>
  );
}
