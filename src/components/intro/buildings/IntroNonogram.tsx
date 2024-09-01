import { Animated, Image, StyleSheet, useAnimatedValue } from "react-native";
import NonogramIcon, { NonogramIconType } from "../../NonogramIcon";
import { useEffect } from "react";

type Props = {
  type: NonogramIconType;
  onPress: () => void;
  status: "completed" | "available" | "locked";
};

const getAnimationValueFromStatus = (status: Props["status"]) => {
  switch (status) {
    case "locked":
      return -1;
    case "available":
      return 0;
    case "completed":
      return 1;
    default:
      return 0;
  }
};
export default function IntroNonogram({ type, onPress, status }: Props) {
  const animatedValue = useAnimatedValue(getAnimationValueFromStatus(status));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: getAnimationValueFromStatus(status),
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [status, animatedValue]);

  return (
    <Animated.View
      style={{
        transform: [
          {
            scale: animatedValue.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: [0.8, 1, 0.8],
            }),
          },
        ],
        opacity: animatedValue.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [0.7, 1, 1],
        }),
      }}
    >
      <NonogramIcon
        type={type}
        onPress={onPress}
        disabled={status !== "available"}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            justifyContent: "center",
            alignItems: "center",
            opacity: animatedValue.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: [0, 0, 1],
            }),
          },
        ]}
      >
        <Image
          source={require("@assets/images/icons/check-circle.png")}
          style={{
            width: 50,
            height: 50,
            tintColor: "#16a34a",
            backgroundColor: "white",
            borderRadius: 100,
          }}
        />
      </Animated.View>
    </Animated.View>
  );
}
