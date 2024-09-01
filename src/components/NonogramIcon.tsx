import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  ImageSourcePropType,
  Pressable,
  useAnimatedValue,
} from "react-native";

const SIZE = 125;

export type NonogramIconType = "default" | "sun" | "tree" | "building" | "seed";

const ICON_MAP: Record<NonogramIconType, ImageSourcePropType> = {
  default: require("@/assets/images/nonogram-icons/default.png"),
  sun: require("@/assets/images/nonogram-icons/sun.png"),
  tree: require("@/assets/images/nonogram-icons/tree.png"),
  building: require("@/assets/images/nonogram-icons/building.png"),
  seed: require("@/assets/images/nonogram-icons/seed.png"),
};

type NonogramIconProps = {
  type: NonogramIconType;
  onPress: () => void;
  disabled?: boolean;
};

export default function NonogramIcon({
  type,
  onPress,
  disabled,
}: NonogramIconProps) {
  const rotate = useAnimatedValue(0);
  const scale = useAnimatedValue(0);

  const iconScale = useAnimatedValue(1);
  const pressedScale = useAnimatedValue(1);

  const isPressedRef = useRef(false);

  const onPressChange = (isPressed: boolean) => {
    if (isPressedRef.current === isPressed) {
      return;
    }

    isPressedRef.current = isPressed;

    Animated.spring(pressedScale, {
      toValue: isPressed ? 0.9 : 1,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 7000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
    Animated.loop(
      Animated.timing(scale, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(iconScale, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]),
    ).start();
  }, [rotate, scale, iconScale]);

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => onPressChange(true)}
      onPressOut={() => onPressChange(false)}
      onPress={onPress}
    >
      <Animated.View
        style={{
          width: SIZE,
          height: SIZE,
          justifyContent: "center",
          alignItems: "center",
          transform: [
            {
              scale: pressedScale,
            },
          ],
        }}
      >
        <Animated.Image
          source={ICON_MAP[type]}
          style={{
            width: SIZE,
            height: SIZE,
            resizeMode: "contain",
            transform: [
              {
                scale: iconScale,
              },
            ],
          }}
        />
        <Animated.View
          style={{
            position: "absolute",
            width: "55%",
            height: "55%",
            zIndex: -1,
            backgroundColor: "#fbbf24cc",
            transform: [
              {
                rotate: rotate.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
              {
                scale: scale.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 1.2, 1],
                }),
              },
            ],
          }}
        />
        <Animated.View
          style={{
            position: "absolute",
            width: "65%",
            height: "55%",
            zIndex: -1,
            backgroundColor: "#fbbf2466",
            transform: [
              {
                rotate: rotate.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["45deg", "405deg"],
                }),
              },
              {
                scale: scale.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 1.1, 1],
                }),
              },
            ],
          }}
        />
      </Animated.View>
    </Pressable>
  );
}
