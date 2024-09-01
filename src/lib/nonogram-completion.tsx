import { useEffect, useRef } from "react";
import { NonogramKey } from "../constants/nonograms.generated";

const listeners = new Map<NonogramKey, Map<number, () => void>>();

export const useNonogramCompletionListener = (
  nonogramKey: NonogramKey | undefined,
  onComplete: () => void,
) => {
  const id = useRef(Math.random()).current;

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!nonogramKey) {
      return;
    }

    if (!listeners.has(nonogramKey)) {
      listeners.set(nonogramKey, new Map());
    }

    const handler = () => {
      onCompleteRef.current();
    };

    listeners.get(nonogramKey)!.set(id, handler);

    return () => {
      listeners.get(nonogramKey)!.delete(id);
    };
  }, [nonogramKey, id]);
};

export const onNonogramComplete = (nonogramKey: NonogramKey) => {
  listeners.get(nonogramKey)?.forEach((handler) => handler());
};
