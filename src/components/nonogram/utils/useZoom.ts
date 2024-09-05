import { useEffect, useState } from "react";
import { Animated, useAnimatedValue } from "react-native";

export const MAX_ZOOM = 2;

const useZoom = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const zoomScaleAnimatedValue = useAnimatedValue(isZoomed ? MAX_ZOOM : 1);

  useEffect(() => {
    Animated.spring(zoomScaleAnimatedValue, {
      toValue: isZoomed ? MAX_ZOOM : 1,
      useNativeDriver: true,
    }).start();
  }, [isZoomed, zoomScaleAnimatedValue]);

  return { isZoomed, setIsZoomed, zoomScaleAnimatedValue };
};

export default useZoom;
