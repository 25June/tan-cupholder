'use client';

import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { FeatureImage } from '@/models/featureImage';
import { useDeferredValue } from 'react';
import { onOpenModal } from '@/shared/utils/modal.utils';
import { MODAL_ID } from '@/constants/modal.const';

export default function CreateFeatureImage() {
  const handleClick = () => {
    onOpenModal(MODAL_ID.ADD_FEATURE_IMAGE);
  };

  return (
    <button
      onClick={handleClick}
      className="flex h-10 items-center rounded-lg bg-logo-orange-border px-4 text-sm font-medium text-white transition-colors hover:bg-logo-orange-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-logo-orange-border"
    >
      <span className="hidden md:block">Add</span>
      <PlusIcon className="h-5 md:ml-4" />
    </button>
  );
}

export function DeleteFeatureImage({
  images,
  callback
}: {
  images: Record<string, FeatureImage | undefined>;
  callback: () => void;
}) {
  const numberOfImages = useDeferredValue(
    Object.values(images).filter((image) => image !== undefined).length
  );

  const handleClick = () => {
    if (numberOfImages === 0) {
      return;
    }
    const modal = document.getElementById(
      MODAL_ID.DELETE_FEATURE_IMAGES
    ) as HTMLDialogElement;
    if (modal) {
      modal.setAttribute('data-images', JSON.stringify(images));
      onOpenModal(MODAL_ID.DELETE_FEATURE_IMAGES);
    }
  };

  return (
    <button
      disabled={numberOfImages === 0}
      type="button"
      onClick={handleClick}
      className={`btn btn-soft btn-error`}
    >
      <TrashIcon className="w-5" />
      <div
        className={`badge badge-sm ${numberOfImages > 0 ? 'badge-error' : ''}`}
      >
        +{numberOfImages}
      </div>
    </button>
  );
}
