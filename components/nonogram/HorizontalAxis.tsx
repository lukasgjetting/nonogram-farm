import { View, Text } from "react-native";
import getRowHeaderDigits from "./utils/getRowHeaderDigits";
import { TileMap } from "./Nonogram";

export type HorizontalAxisProps = {
  digits: number[][];
  tileSize: number;
  tileGap: number;
  digitSize: number;
};

export default function HorizontalAxis({
  digits: horizontalHeader,
  tileSize,
  tileGap,
  digitSize,
}: HorizontalAxisProps) {
  return (
    <View style={{ flexDirection: "row", gap: tileGap }}>
      {horizontalHeader.map((digits, index) => (
        <View
          key={index}
          style={{
            width: tileSize,
            gap: tileGap,
            justifyContent: "flex-end",
            backgroundColor: "#e9e9e9",
          }}
        >
          {digits.map((digit, digitIndex) => (
            <View
              key={digitIndex}
              style={{
                height: digitSize,
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
