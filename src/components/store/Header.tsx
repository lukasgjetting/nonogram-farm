import { View } from "react-native";
import Text from "../Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
};

export default function Header({ children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <>
      <Text
        font="semibold"
        style={{ marginTop: insets.top + 80, fontSize: 40, color: "#E4C8A7" }}
      >
        {children}
      </Text>
      <View
        style={{
          width: "62%",
          height: 3,
          borderRadius: 100,
          opacity: 0.2,
          backgroundColor: "#2A2017",
          marginBottom: 36,
        }}
      />
    </>
  );
}
