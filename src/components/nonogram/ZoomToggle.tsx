import { TouchableOpacity } from "react-native";
import Text from "../Text";

type ZoomToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function ZoomToggle({ value, onChange }: ZoomToggleProps) {
  return (
    <TouchableOpacity
      style={{
        padding: 8,
        backgroundColor: "white",
        borderRadius: 8,
      }}
      onPress={() => onChange(!value)}
    >
      <Text>{value ? "Zoom out" : "Zoom in"}</Text>
    </TouchableOpacity>
  );
}
