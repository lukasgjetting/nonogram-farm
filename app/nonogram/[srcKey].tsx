import { BackHandler, View } from "react-native";
import Nonogram from "@/components/nonogram/Nonogram";
import { NonogramKey, NonogramSources } from "@/constants/nonograms.generated";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import Health from "@/components/nonogram/Health";

const MAX_HEALTH = 3;

export default function NonogramScreen() {
  const params = useLocalSearchParams<{ srcKey: string }>();
  const isValidKey = Object.keys(NonogramSources).includes(params.srcKey);

  const [health, setHealth] = useState(MAX_HEALTH);

  useEffect(() => {
    if (!isValidKey) {
      router.back();
    }
  }, [isValidKey]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );

    return () => backHandler.remove();
  }, []);

  if (!isValidKey) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
        alignItems: "center",
      }}
    >
      <Health maxHealth={MAX_HEALTH} currentHealth={health} />
      <View style={{ height: 8 }} />
      <Nonogram
        srcKey={params.srcKey as NonogramKey}
        onGuessWrong={() =>
          setHealth((prev) => (prev === 0 ? MAX_HEALTH : prev - 1))
        }
      />
    </View>
  );
}
