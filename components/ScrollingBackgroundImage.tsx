import { windowSize } from "@/constants/windowSize";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageProps,
  StyleSheet,
  View,
} from "react-native";

type ScrollingBackgroundImageProps = {
  source: ImageProps["source"];
  speed: number;
  aspectRatio: number;
  style?: ImageProps["style"];
};

export default function ScrollingBackgroundImage({
  source,
  speed = 1,
  style,
  aspectRatio,
}: ScrollingBackgroundImageProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const duration = (aspectRatio * 1000) / speed;
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
  }, [animatedValue, speed, aspectRatio]);

  const imageHeight = windowSize.height;
  const imageWidth = imageHeight * aspectRatio;

  const imageElement = (
    <Image
      source={source}
      resizeMode="cover"
      style={[
        {
          height: imageHeight,
          width: imageWidth,
        },
        style,
      ]}
    />
  );

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        style={{
          flexDirection: "row",
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -imageWidth],
              }),
            },
          ],
        }}
      >
        {imageElement}
        {imageElement}
      </Animated.View>
    </View>
  );
}
