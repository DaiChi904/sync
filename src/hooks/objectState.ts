import { useCallback, useState } from "react";

export const useObjectState = <T>(initialState: T) => {
  const [object, _setObject_] = useState<T>(initialState);

  const setObject = useCallback((property: keyof T, value: T[keyof T]) => {
    _setObject_((prevObject) => ({
      ...prevObject,
      [property]: value,
    }));
  }, []);

  return [object, setObject] as const;
};
