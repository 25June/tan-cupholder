export function formatPrice(price: number, currency: string = 'USD') {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  }
  return price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
}
