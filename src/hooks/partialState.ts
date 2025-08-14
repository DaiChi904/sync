import { useCallback, useState } from "react";

export const usePartialState = <T>(initialState: T) => {
  const [object, _setObject_] = useState<T>(initialState);

  const setObject = useCallback(<K extends keyof T>(property: K, value: T[K]) => {
    _setObject_((prevObject) => ({
      ...prevObject,
      [property]: value,
    }));
  }, []);

  return [object, setObject] as const;
};
