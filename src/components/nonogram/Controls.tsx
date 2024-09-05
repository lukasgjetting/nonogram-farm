import { Animated, useAnimatedValue } from "react-native";
import PutCrossesToggle from "./PutCrossesToggle";
import ZoomToggle from "./ZoomToggle";
import { useEffect } from "react";

type ControlsProps = {
  show: boolean;
  isPuttingCrosses: boolean;
  onIsPuttingCrossesChange: (value: boolean) => void;
  isZoomed: boolean;
  onIsZoomedChange: (value: boolean) => void;
};

export default function Controls({
  show,
  isPuttingCrosses,
  onIsPuttingCrossesChange,
  isZoomed,
  onIsZoomedChange,
}: ControlsProps) {
  const animatedValue = useAnimatedValue(show ? 1 : 0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: show ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, show]);

  return (
    <Animated.View
      style={{
        opacity: animatedValue,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 16,
      }}
    >
      <PutCrossesToggle
        value={isPuttingCrosses}
        onChange={onIsPuttingCrossesChange}
      />
      <ZoomToggle value={isZoomed} onChange={onIsZoomedChange} />
    </Animated.View>
  );
}
