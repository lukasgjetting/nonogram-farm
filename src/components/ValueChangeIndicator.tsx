import { useEffect } from "react";
import {
  Animated,
  StyleProp,
  TextStyle,
  useAnimatedValue,
  ViewStyle,
} from "react-native";
import Text from "./Text";

const POSITIVE_CHANGE_COLOR = "#16a34a";
const NEGATIVE_CHANGE_COLOR = "#dc2626";

type ValueChangeIndicatorProps = {
  change: number;
  onComplete: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  duration?: number;
};

export default function ValueChangeIndicator({
  change,
  onComplete,
  style,
  textStyle,
  duration = 1000,
}: ValueChangeIndicatorProps) {
  const animatedValue = useAnimatedValue(0);

  useEffect(() => {
    animatedValue.stopAnimation();

    if (change === 0) {
      animatedValue.setValue(0);
      return;
    }

    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start(() => {
      onComplete();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [change, animatedValue]);

  return (
    <Animated.View
      pointerEvents={"none"}
      style={[
        {
          position: "absolute",
          opacity: animatedValue.interpolate({
            inputRange: [0, 0.1, 1],
            outputRange: [0, 1, 0],
          }),
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -24],
              }),
            },
          ],
        },
        style,
      ]}
    >
      <Text
        style={[
          {
            fontSize: 18,
            color: change > 0 ? POSITIVE_CHANGE_COLOR : NEGATIVE_CHANGE_COLOR,
          },
          textStyle,
        ]}
      >
        {`${change > 0 ? "+" : "-"}${Math.abs(change)}`}
      </Text>
    </Animated.View>
  );
}
