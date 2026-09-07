import { useCallback, useState } from "react";

type Fn<T> = (prev: T) => T;

const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const items = window.localStorage.getItem(key);
    return items ? (JSON.parse(items) as T) : initialValue;
  });

  const setValue = useCallback(
    (value: T | Fn<T>) => {
      setStoredValue((prev) => {
        const updateValue =
          typeof value === "function" ? (value as Fn<T>)(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(updateValue));
        console.log(typeof value, updateValue);

        return updateValue;
      });
    },
    [key],
  );

  const removeValue = useCallback(() => {
    console.warn(initialValue, "initial1", key);
    setStoredValue(initialValue);
    console.warn(initialValue, "2", key);
    window.localStorage.removeItem(key);
  }, [key, initialValue]);

  console.warn(storedValue, "stred");
  return [storedValue, setValue, removeValue] as const;
};

export default useLocalStorage;
