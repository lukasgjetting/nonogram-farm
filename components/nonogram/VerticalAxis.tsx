import { View, Text } from "react-native";
import getRowHeaderDigits from "./utils/getRowHeaderDigits";
import { TileMap } from "./Nonogram";

export type VerticalAxisProps = {
  digits: number[][];
  tileSize: number;
  tileGap: number;
  digitSize: number;
};

export default function VerticalAxis({
  digits: verticalHeader,
  tileSize,
  tileGap,
  digitSize,
}: VerticalAxisProps) {
  return (
    <View style={{ gap: tileGap, top: -tileGap }}>
      {verticalHeader.map((digits, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            height: tileSize,
            gap: tileGap,
            justifyContent: "flex-end",
            backgroundColor: "#e9e9e9",
          }}
        >
          {digits.map((digit, digitIndex) => (
            <View
              key={digitIndex}
              style={{
                width: digitSize,
                justifyContent: "center",
              }}
            >
              <Text style={{ textAlign: "center" }}>{digit}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
