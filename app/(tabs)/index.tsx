import { View } from "react-native";
import Nonogram from "@/components/nonogram/Nonogram";

export default function HomeScreen() {
  return (
    <View
      style={{ flex: 1, justifyContent: "center", backgroundColor: "white" }}
    >
      <Nonogram srcKey="intro.house" />
    </View>
  );
}
