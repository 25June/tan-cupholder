export function formatPrice(
  price: number,
  currency: string = 'USD',
  noSymbol: boolean = false
) {
  if (noSymbol) {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  }
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  }
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

export function formatPriceWithoutSymbol(price: number) {
  return new Intl.NumberFormat('it-IT', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(price);
}
