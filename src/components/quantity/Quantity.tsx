import MinusCircle from '@/components/icons/MinusCircle';
import PlusCircle from '@/components/icons/PlusCircle';
import { useState } from 'react';

export default function Quantity() {
  const [quantity, setQuantity] = useState<number>(1);
  return (
    <div>
      <p className="text-md font-bold mb-2">Quantity</p>
      <div className="flex items-center gap-2">
        <button
          className="btn btn-primary btn-sm btn-soft"
          onClick={() => setQuantity(quantity - 1)}
        >
          <MinusCircle className="size-6" />
        </button>
        <span className="text-md font-bold mx-4">{quantity}</span>
        <button
          className="btn btn-primary btn-sm btn-soft"
          onClick={() => setQuantity(quantity + 1)}
        >
          <PlusCircle className="size-6" />
        </button>
      </div>
    </div>
  );
}
