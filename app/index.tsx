import { View } from "react-native";
import { Link } from "expo-router";
import getNonogramHref from "@/utils/getNonogramHref";

export default function HomeScreen() {
  return (
    <View
      style={{ flex: 1, justifyContent: "center", backgroundColor: "white" }}
    >
      <Link href={getNonogramHref("intro.house")}>Intro House</Link>
    </View>
  );
}
