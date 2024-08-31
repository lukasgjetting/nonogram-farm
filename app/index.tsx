import { ImageBackground, StatusBar, StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import getNonogramHref from "@/utils/getNonogramHref";
import Text from "@/components/Text";
import ScrollingBackgroundImage from "@/components/ScrollingBackgroundImage";
import { windowSize } from "@/constants/windowSize";
import { useSaveData } from "./lib/save-data";
import hasCompletedIntroStep from "@/utils/hasCompletedIntroStep";
import NightOverlay from "@/components/intro/NightOverlay";
import GrandpaDialogue from "@/components/GrandpaDialogue";

export default function HomeScreen() {
  const [saveData, setSaveData] = useSaveData();

  const hasCompletedSun = hasCompletedIntroStep("sun", saveData);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={"dark-content"} />
      <ImageBackground
        style={{ flex: 1, justifyContent: "center", backgroundColor: "red" }}
        imageStyle={{ resizeMode: "cover" }}
        source={require("@assets/images/farm.png")}
      >
        <View style={{ flex: 1 }}>
          <ScrollingBackgroundImage
            source={require("@/assets/images/clouds-small.png")}
            aspectRatio={6.4}
            speed={0.3}
            height={windowSize.height * 0.1}
          />
        </View>
      </ImageBackground>
      {!hasCompletedSun && (
        <>
          <NightOverlay />
          <GrandpaDialogue
            text={`Hello dear!\n\nI'm so glad you are here! Truly very fortunate cause I am in trouble. Big trouble! To hear more about all my troubles, please tell me a bit about yourself and how you are doing. Do you like doing this whole farming thing?`}
          />
        </>
      )}
    </View>
  );
}
