import { ProductWithQuantity } from '@/hooks/useGetProductsFromCart';

export const priceSummary = (products: ProductWithQuantity[]) => {
  return products.reduce(
    (acc, product) => {
      const discountedPrice = product.price * (1 - product.sale / 100);
      return {
        totalPrice: acc.totalPrice + product.price * product.quantity,
        totalQuantity: acc.totalQuantity + product.quantity,
        totalPriceAfterDiscount:
          acc.totalPriceAfterDiscount + discountedPrice * product.quantity
      };
    },
    {
      totalPrice: 0,
      totalQuantity: 0,
      totalPriceAfterDiscount: 0
    }
  );
};
