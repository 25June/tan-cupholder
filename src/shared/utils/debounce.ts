export const debounce = (func: (data: any) => void, delay: number) => {
  let timeoutId: any;

  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
