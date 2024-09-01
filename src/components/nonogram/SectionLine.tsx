import { memo } from "react";
import { View } from "react-native";

const SECTION_LINE_COLOR = "#CCC";
const SECTION_LINE_WIDTH = 2;

type SectionLineProps = {
  direction: "horizontal" | "vertical";
  tileSize: number;
  tileGap: number;
  index: number;
};

export default memo(function SectionLine({
  direction,
  tileSize,
  tileGap,
  index,
}: SectionLineProps) {
  return (
    <View
      pointerEvents="none"
      style={[
        {
          backgroundColor: SECTION_LINE_COLOR,
          position: "absolute",
          zIndex: -5,
        },
        direction === "horizontal"
          ? {
              height: SECTION_LINE_WIDTH,
              left: 0,
              right: 0,
              bottom: index * (tileSize + tileGap),
            }
          : {
              width: SECTION_LINE_WIDTH,
              top: 0,
              bottom: 0,
              right: index * (tileSize + tileGap),
            },
      ]}
    />
  );
});
