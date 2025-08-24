import { ShoppingCartIcon } from '@heroicons/react/24/outline';

interface Props {
  cartCount: number;
}

export default function CartIcon({ cartCount }: Props) {
  console.log(cartCount);

  if (cartCount === 0) {
    return <ShoppingCartIcon className="w-5 h-5" />;
  }

  return (
    <div className="relative border-2 box-border border-logo-orange bg-logo-orange rounded-lg overflow-hidden flex items-center justify-center ">
      <ShoppingCartIcon className="w-5 h-5 flex-shrink-0 p-[2px] bg-white" />
      <div className="bg-logo-orange text-white text-center text-xs font-bold w-4 h-full">
        {cartCount}
      </div>
    </div>
  );
}
