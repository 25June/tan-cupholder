export const debounce = (func: (data: any) => void, delay: number) => {
  let timeoutId: any;

  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export const reducePolyfill = (
  arr: any[],
  callback: (acc: any, cur: any, index: number, array: any[]) => any,
  initialValue: any
) => {
  let accumulator = initialValue;
  for (let i = 0; i < arr.length; i++) {
    accumulator = callback(accumulator, arr[i], i, arr);
  }
  return accumulator;
};

const newArr = [1, 2, 3];
console.log(reducePolyfill(newArr, (acc, cur) => acc + cur, 0));
