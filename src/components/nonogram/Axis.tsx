import { View } from "react-native";
import { memo } from "react";
import AxisLine from "./AxisLine";

export type VerticalAxisProps = {
  allDigits: number[][];
  completedIndexes: number[];
  tileSize: number;
  tileGap: number;
  digitSize: number;
  direction: "vertical" | "horizontal";
};

export default memo(function Axis({
  allDigits,
  completedIndexes,
  tileSize,
  tileGap,
  digitSize,
  direction,
}: VerticalAxisProps) {
  return (
    <View
      style={[
        { gap: tileGap },
        direction === "vertical"
          ? { top: -tileGap }
          : { left: tileGap, flexDirection: "row" },
      ]}
    >
      {allDigits.map((digits, index) => (
        <AxisLine
          key={index}
          direction={direction}
          digits={digits}
          isCompleted={completedIndexes.includes(index)}
          digitSize={digitSize}
          tileSize={tileSize}
          tileGap={tileGap}
        />
      ))}
    </View>
  );
});
