export const chunkArray = (arr: any[], chunkSize: number) => {
  return arr.reduce((acc, _, i) => {
    if (i % chunkSize === 0) {
      acc.push(arr.slice(i, i + chunkSize));
    }
    return acc;
  }, []);
};
