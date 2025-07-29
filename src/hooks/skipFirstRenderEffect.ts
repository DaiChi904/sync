import { useEffect, useRef, useState } from "react";

export const useSkipFirstRenderEffect = (): boolean => {
  const skip = useRef(true);
  const [sholdRender, setSholdRender] = useState(false);

  useEffect(() => {
    if (skip.current) {
      skip.current = false;
    } else {
      setSholdRender(true);
    }
  });

  return sholdRender;
};
