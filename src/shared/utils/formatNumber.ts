export const numberWithCommas = (x: number) => {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
};

export const calculatePercent = (price: number, percent: number) => {
  const actualPrice = price - (price / 100) * percent;
  const ceilingNumber = Math.ceil(actualPrice);
  return ceilingNumber;
};
