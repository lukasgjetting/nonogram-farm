import { Image, TouchableOpacity } from "react-native";
import Colors from "@/src/constants/colors";

const BUTTON_SIZE = 64;
const ICON_SIZE = 30;

type ZoomToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function ZoomToggle({ value, onChange }: ZoomToggleProps) {
  return (
    <TouchableOpacity
      style={{
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE,
        backgroundColor: value ? "white" : Colors.ACCENT_TRANSPARENT,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      activeOpacity={0.8}
      onPress={() => onChange(!value)}
    >
      <Image
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          tintColor: Colors.DARK,
        }}
        source={
          value
            ? require("@/assets/images/icons/zoom-minus.png")
            : require("@/assets/images/icons/zoom-plus.png")
        }
      />
    </TouchableOpacity>
  );
}
