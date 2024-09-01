import { ImageBackground, StyleProp, ViewStyle } from "react-native";
import Text from "./Text";

type QuantityIndicatorProps = {
  quantity: number;
  style?: StyleProp<ViewStyle>;
};

export default function QuantityIndicator({
  quantity,
  style,
}: QuantityIndicatorProps) {
  return (
    <ImageBackground
      source={require("@assets/images/progress-background.png")}
      style={[
        {
          borderRadius: 100,
          overflow: "hidden",
          height: 24,
          width: 24,
          alignItems: "center",
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: 18,
          textAlign: "center",
          top: 4,
        }}
      >
        {quantity}
      </Text>
    </ImageBackground>
  );
}
