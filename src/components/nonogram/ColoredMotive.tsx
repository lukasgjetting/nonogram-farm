import {
  getNonogramColorMap,
  NonogramKey,
} from "@/src/constants/nonograms.generated";
import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

type ColoredMotiveProps = {
  nonogramKey: NonogramKey;
  tileSize: number;
  tileGap: number;
};

export default function ColoredMotive({
  nonogramKey,
  tileSize,
  tileGap,
}: ColoredMotiveProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);

  const colorMap = getNonogramColorMap(nonogramKey);
  return (
    <Animated.View style={{ opacity: animatedValue }}>
      {colorMap.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: "row" }}>
          {row.map((color, colIndex) => (
            <View
              key={colIndex}
              style={{
                backgroundColor: color,
                width: tileSize + tileGap,
                height: tileSize + tileGap,
              }}
            />
          ))}
        </View>
      ))}
    </Animated.View>
  );
}
