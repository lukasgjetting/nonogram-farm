import { useEffect, useState } from "react";
import { Animated, useAnimatedValue } from "react-native";

export const MAX_ZOOM = 2;

const useZoom = (isCompleted: boolean) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const zoomScaleAnimatedValue = useAnimatedValue(isZoomed ? MAX_ZOOM : 1);

  useEffect(() => {
    Animated.spring(zoomScaleAnimatedValue, {
      toValue: !isCompleted && isZoomed ? MAX_ZOOM : 1,
      useNativeDriver: true,
    }).start();
  }, [isZoomed, zoomScaleAnimatedValue, isCompleted]);

  return { isZoomed, setIsZoomed, zoomScaleAnimatedValue };
};

export default useZoom;
