import {
  CheckCircleIcon,
  PencilIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteProduct } from '@/app/admin/lib/actions/products.actions';
import Spinner from '@/components/spinner/Spinner';

export function CreateProduct() {
  return (
    <Link
      href="/admin/dashboard/products/create"
      prefetch={true}
      className="flex h-10 items-center rounded-lg bg-logo-orange-border px-4 text-sm font-medium text-white transition-colors hover:bg-logo-orange-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-orange-border"
    >
      <span className="hidden md:block">Create Product</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateProduct({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/dashboard/products/${id}/edit`}
      prefetch={true}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function UpdateImage({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/dashboard/products/${id}/edit-image`}
      prefetch={true}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PhotoIcon className="w-5" />
    </Link>
  );
}

export function DeleteProduct({ id }: { id: string }) {
  const handleDeleteProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await deleteProduct(id);
  };

  return (
    <form onSubmit={handleDeleteProduct}>
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

export function DeleteImage({
  onClick,
  loading
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border border-red-400 hover:bg-red-400 hover:text-white transition-all duration-300 ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <div className="p-2">
          <Spinner />
        </div>
      ) : (
        <TrashIcon className="w-10 text-red-500 p-2 hover:text-white transition-all duration-300" />
      )}
    </button>
  );
}

export function ActiveButton({
  onClick,
  loading
}: {
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border border-green-500 hover:bg-green-500 hover:text-white  transition-all duration-300 ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <div className="p-2">
          <Spinner />
        </div>
      ) : (
        <CheckCircleIcon className="w-10 text-green-500 p-2 hover:text-white transition-all duration-300" />
      )}
    </button>
  );
}
