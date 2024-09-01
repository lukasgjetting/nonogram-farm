import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Text from "./Text";

type ButtonType = "primary" | "default" | "link";

type ButtonProps = {
  type: ButtonType;
  onPress: () => void;
  children: React.ReactNode;
};

const sizeToStyle: Record<
  ButtonType,
  {
    container: StyleProp<ViewStyle>;
    text: StyleProp<TextStyle>;
  }
> = {
  primary: {
    container: {
      backgroundColor: "#06b6d4",
    },
    text: {
      color: "white",
    },
  },
  default: {
    container: {
      backgroundColor: "gray",
    },
    text: {},
  },
  link: {
    container: {
      backgroundColor: "transparent",
    },
    text: {},
  },
};

export default function Button({ type, onPress, children }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          {
            paddingVertical: 16,
            borderRadius: 8,
          },
          sizeToStyle[type].container,
        ]}
      >
        <Text style={[{ textAlign: "center" }, sizeToStyle[type].text]}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
