import { useEffect } from "react";
import { Animated, StyleSheet, useAnimatedValue, View } from "react-native";

type NightOverlayProps = {
  isVisible: boolean;
};

export default function NightOverlay({ isVisible }: NightOverlayProps) {
  const animatedValue = useAnimatedValue(isVisible ? 1 : 0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isVisible ? 1 : 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, isVisible]);

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { opacity: animatedValue }]}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "#d03e10",
            opacity: 0.5,
          },
        ]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "#091451",
            opacity: 0.5,
          },
        ]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "#000",
            opacity: 0.2,
          },
        ]}
      />
    </Animated.View>
  );
}
