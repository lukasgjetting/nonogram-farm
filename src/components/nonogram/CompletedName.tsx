import { NonogramKey, NonogramSources } from "@/src/constants/nonograms.generated";
import Text from "../Text";
import { Animated, useAnimatedValue } from "react-native";
import { useEffect } from "react";

type Props = {
  nonogramKey: NonogramKey;
};
export default function CompletedName({ nonogramKey }: Props) {
  const animatedValue = useAnimatedValue(0);

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      delay: 250,
    }).start();
  }, [animatedValue]);

  return (
    <Animated.View
      style={{
        opacity: animatedValue,
        transform: [
          {
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }),
          },
        ],
      }}
    >
      <Text style={{ fontSize: 28, textAlign: "center" }}>
        {NonogramSources[nonogramKey].name}
      </Text>
    </Animated.View>
  );
}
