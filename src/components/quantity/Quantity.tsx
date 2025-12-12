import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction } from 'react';
import { motion } from 'motion/react';

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
        <motion.button
          onClick={() => setQuantity((prev) => (prev === 0 ? 0 : prev - 1))}
          whileHover={{ scale: 1.25 }}
          whileTap={{ scale: 0.8 }}
          className={`bg-logo-orange-pale-companion rounded-full p-2`}
        >
          <MinusIcon className={'size-6 stroke-logo-orange-border'} />
        </motion.button>
        <span className={`${textSize} font-bold mx-4`}>{quantity}</span>
        <motion.button
          className={`bg-logo-orange-pale-companion rounded-full p-2`}
          onClick={() => setQuantity((prev) => prev + 1)}
          whileHover={{ scale: 1.25 }}
          whileTap={{ scale: 0.8 }}
        >
          <PlusIcon className={'size-6 stroke-logo-orange-border'} />
        </motion.button>
      </div>
    </div>
  );
}
