import { useEffect } from "react";
import { Animated, Text, useAnimatedValue } from "react-native";

const BACKGROUND_COLOR = "#0ea5e933";
const COMPLETED_BACKGROUND_COLOR = "#cccccc33";

type AxisLineProps = {
  isCompleted: boolean;
  digitSize: number;
  tileSize: number;
  tileGap: number;
  direction: "vertical" | "horizontal";
  digits: number[];
};

export default function AxisLine({
  isCompleted,
  digitSize,
  tileSize,
  tileGap,
  direction,
  digits,
}: AxisLineProps) {
  const completedAnimatedValue = useAnimatedValue(isCompleted ? 1 : 0);

  useEffect(() => {
    Animated.timing(completedAnimatedValue, {
      toValue: isCompleted ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isCompleted, completedAnimatedValue]);

  return (
    <Animated.View
      style={[
        {
          gap: tileGap,
          alignItems: "center",
          justifyContent: "flex-end",
          backgroundColor: completedAnimatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [BACKGROUND_COLOR, COMPLETED_BACKGROUND_COLOR],
          }),
        },
        direction === "vertical"
          ? {
              height: tileSize,
              flexDirection: "row",
              borderBottomLeftRadius: 15,
              borderTopLeftRadius: 15,
              paddingHorizontal: 5,
            }
          : {
              width: tileSize,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              paddingVertical: 5,
            },
      ]}
    >
      {digits.map((digit, digitIndex) => (
        <Animated.View
          key={digitIndex}
          style={{
            width: digitSize,
            justifyContent: "center",
            alignItems: "center",
            opacity: completedAnimatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.6],
            }),
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: digitSize,
              marginHorizontal: -8,
            }}
            numberOfLines={1}
          >
            {digit}
          </Text>
        </Animated.View>
      ))}
    </Animated.View>
  );
}
