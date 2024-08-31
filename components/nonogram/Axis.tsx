import { View, Text } from "react-native";

export type VerticalAxisProps = {
  allDigits: number[][];
  tileSize: number;
  tileGap: number;
  digitSize: number;
  direction: "vertical" | "horizontal";
};

const BACKGROUND_COLOR = "#0ea5e933";

export default function Axis({
  allDigits,
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
        <View
          key={index}
          style={[
            {
              gap: tileGap,
              alignItems: "center",
            },
            direction === "vertical"
              ? {
                  height: tileSize,
                  backgroundColor: BACKGROUND_COLOR,
                  justifyContent: "flex-end",
                  flexDirection: "row",
                  borderBottomLeftRadius: 15,
                  borderTopLeftRadius: 15,
                  paddingHorizontal: 5,
                }
              : {
                  width: tileSize,
                  backgroundColor: BACKGROUND_COLOR,
                  justifyContent: "flex-end",
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  paddingVertical: 5,
                },
          ]}
        >
          {digits.map((digit, digitIndex) => (
            <View
              key={digitIndex}
              style={{
                width: digitSize,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: digitSize,
                }}
              >
                {digit}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
