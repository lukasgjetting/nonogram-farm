import { useEffect } from "react";
import { Animated, EasingFunction, useAnimatedValue } from "react-native";

const useMultiStepTiming = (opts: {
  initialValue: number;
  steps: [number, number][];
  duration: number;
  isActive?: boolean;
  easing?: EasingFunction;
  onComplete?: () => void;
}) => {
  const {
    initialValue,
    steps,
    duration,
    isActive = true,
    easing,
    onComplete,
  } = opts;
  const animatedValue = useAnimatedValue(0);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    animatedValue.stopAnimation();
    animatedValue.setValue(0);

    let totalFraction = 0;

    Animated.sequence(
      steps.map(([fraction]) => {
        const stepFraction = fraction - totalFraction;
        totalFraction = fraction;

        return Animated.timing(animatedValue, {
          toValue: fraction,
          duration: stepFraction * duration,
          useNativeDriver: true,
          easing,
        });
      }),
    ).start(() => {
      onComplete?.();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return animatedValue.interpolate({
    inputRange: [0, ...steps.map(([fraction]) => fraction)],
    outputRange: [initialValue, ...steps.map(([_, value]) => value)],
  });
};

export default useMultiStepTiming;
