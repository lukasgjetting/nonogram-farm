import { NonogramKey } from "@/constants/nonograms.generated";
import { Text, View } from "react-native";

export type NonogramProps = {
  src: NonogramKey;
};

export default function Nonogram({ nonogram }: NonogramProps) {
  return (
    <View>
      <Text>Nonogram</Text>
    </View>
  );
}
