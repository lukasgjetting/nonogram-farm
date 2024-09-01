import { useEffect } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  StyleSheet,
  useAnimatedValue,
  View,
} from "react-native";

type Props = {
  width: number;
  aspectRatio: number;
  source: ImageSourcePropType;
  isVisible: boolean;
  x: number;
  y: number;
  dropDelay?: number;
  position?: "absolute" | "relative";
  children?: React.ReactNode;
};

export type BuildingProps = Pick<Props, "isVisible" | "x" | "y" | "dropDelay">;

export default function Building({
  width,
  aspectRatio,
  source,
  isVisible,
  x,
  y,
  dropDelay,
  position = "absolute",
  children,
}: Props) {
  const animatedValue = useAnimatedValue(isVisible ? 1 : 0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isVisible ? 1 : 0,
      duration: 1000,
      delay: dropDelay,
      useNativeDriver: true,
    }).start();
  }, [isVisible, animatedValue, dropDelay]);

  return (
    <Animated.View
      style={{
        position,
        left: x,
        top: y,
        opacity: animatedValue.interpolate({
          inputRange: [0, 0.4, 1],
          outputRange: [0, 1, 1],
        }),
        transform: [
          {
            translateY: animatedValue.interpolate({
              inputRange: [0, 0.9, 0.95, 1],
              outputRange: [-150, 0, (width / aspectRatio) * 0.05, 0],
            }),
          },
          {
            scaleX: animatedValue.interpolate({
              inputRange: [0, 0.9, 0.95, 1],
              outputRange: [1, 1, 1.1, 1],
            }),
          },
          {
            scaleY: animatedValue.interpolate({
              inputRange: [0, 0.9, 0.95, 1],
              outputRange: [1, 1, 0.9, 1],
            }),
          },
        ],
      }}
    >
      <Image
        source={source}
        style={{ width, height: width / aspectRatio }}
        resizeMode="contain"
      />
      <View style={StyleSheet.absoluteFill}>{children}</View>
    </Animated.View>
  );
}
