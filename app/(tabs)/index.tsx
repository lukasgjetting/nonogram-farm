import { View } from "react-native";
import Nonogram from "@/components/nonogram/Nonogram";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Nonogram src="intro.house" />
    </View>
  );
}
