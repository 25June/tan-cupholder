import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface Props {
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export default function Quantity({ quantity, setQuantity }: Props) {
  return (
    <div>
      <p className="text-md font-bold mb-2">Quantity</p>
      <div className="flex items-center gap-2">
        <button
          className="btn btn-primary btn-sm btn-soft"
          onClick={() => setQuantity(quantity - 1)}
        >
          <MinusCircleIcon className="size-6" />
        </button>
        <span className="text-md font-bold mx-4">{quantity}</span>
        <button
          className="btn btn-primary btn-sm btn-soft"
          onClick={() => setQuantity(quantity + 1)}
        >
          <PlusCircleIcon className="size-6" />
        </button>
      </div>
    </div>
  );
}
