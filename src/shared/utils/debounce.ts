export const debounce = (func: (data: any) => void, delay: number) => {
  let timeoutId: any;

  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
export const throttle = (func: (data: any) => void, limit: number) => {
  let inThrottle: boolean;

  return (...args: any) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};
