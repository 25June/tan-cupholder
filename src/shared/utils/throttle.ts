export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  let lastFunc: T | null;
  let lastRan: number;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): any {
    const context = this;

    if (!inThrottle) {
      const result = func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
      console.log('inThrottle', inThrottle);
      setTimeout(function () {
        inThrottle = false;

        if (lastFunc) {
          lastFunc.apply(context, args);
          lastRan = Date.now();
          lastFunc = null;
        }
      }, limit);

      return result; // Return the result of the immediate call
    } else {
      lastFunc = function () {
        return func.apply(context, args); // Preserve the return value of the queued call
      } as T; // Type assertion to T
    }
  } as T; // Type assertion to T
}
