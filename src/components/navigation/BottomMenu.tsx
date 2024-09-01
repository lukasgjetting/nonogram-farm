import { useSaveData } from "@/src/lib/save-data";
import { View } from "react-native";
import Text from "../Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BottomMenu() {
  const [{ coins, points }] = useSaveData();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingBottom: insets.bottom }}>
      <Text style={{ textAlign: "center" }}>{coins ?? 0} coins</Text>
      <Text style={{ textAlign: "center" }}>{points ?? 0} points</Text>
    </View>
  );
}
