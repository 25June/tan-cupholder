'use client';

import Link from 'next/link';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteFeatureImages } from '@/app/admin/lib/actions/image-feature.actions';
import { FeatureImage } from '@/models/featureImage';
import { useDeferredValue } from 'react';

export default function CreateFeatureImage() {
  return (
    <Link
      href="/admin/dashboard/feature-images/create"
      className="flex h-10 items-center rounded-lg bg-logo-orange-border px-4 text-sm font-medium text-white transition-colors hover:bg-logo-orange-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-orange-border"
    >
      <span className="hidden md:block">Add</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function DeleteFeatureImage({
  images,
  callback
}: {
  images: Record<string, FeatureImage | undefined>;
  callback: () => void;
}) {
  const handleDeleteFeatureImage = async (formData: FormData) => {
    if (
      Object.values(images).filter((image) => image !== undefined).length === 0
    ) {
      return;
    }

    const confirm = window.confirm(
      'Are you sure you want to delete these images?'
    );
    if (!confirm) {
      return;
    }
    await deleteFeatureImages(
      Object.values(images)
        .filter((image) => image !== undefined)
        .map((image) => image.id)
    );
    callback();
  };

  const numberOfImages = useDeferredValue(
    Object.values(images).filter((image) => image !== undefined).length
  );

  return (
    <form action={handleDeleteFeatureImage}>
      <button
        disabled={numberOfImages === 0}
        type="submit"
        className={`btn btn-soft btn-error`}
      >
        <TrashIcon className="w-5" />
        <div
          className={`badge badge-sm ${
            numberOfImages > 0 ? 'badge-error' : ''
          }`}
        >
          +{numberOfImages}
        </div>
      </button>
    </form>
  );
}
