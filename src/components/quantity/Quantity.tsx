import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction, useState } from 'react';

interface Props {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  size?: 'sm' | 'md' | 'lg';
}

export default function Quantity({
  quantity,
  setQuantity,
  size = 'md'
}: Props) {
  const buttonSize =
    size === 'sm' ? 'btn-sm' : size === 'md' ? 'btn-md' : 'btn-lg';
  const textSize =
    size === 'sm' ? 'text-sm' : size === 'md' ? 'text-md' : 'text-lg';
  return (
    <div>
      <p className={`${textSize} font-bold mb-2`}>Quantity</p>
      <div className="flex items-center gap-2">
        <button
          className={`btn btn-primary ${buttonSize} btn-soft`}
          onClick={() => setQuantity((prev) => prev - 1)}
        >
          <MinusCircleIcon className={'size-6'} />
        </button>
        <span className={`${textSize} font-bold mx-4`}>{quantity}</span>
        <button
          className={`btn btn-primary ${buttonSize} btn-soft`}
          onClick={() => setQuantity((prev) => prev + 1)}
        >
          <PlusCircleIcon className={'size-6'} />
        </button>
      </div>
    </div>
  );
}
