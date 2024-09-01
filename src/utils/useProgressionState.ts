import { useCallback, useState } from "react";

const useProgressionState = () => {
  const [index, setIndex] = useState(0);

  const onProgress = useCallback(() => {
    setIndex((i) => i + 1);
  }, []);

  return {
    progress: index === 0 ? [] : new Array(index).fill(true),
    onProgress,
  };
};

export default useProgressionState;
