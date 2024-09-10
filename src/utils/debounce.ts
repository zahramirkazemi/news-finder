const debounce = <T extends (value: string) => void>(func: T, delay: number): (value: string) => void => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (value: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(value);
    }, delay);
  };
};

export default debounce;