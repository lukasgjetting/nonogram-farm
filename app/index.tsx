import { ImageBackground, StatusBar, View } from "react-native";
import ScrollingBackgroundImage from "@/components/ScrollingBackgroundImage";
import { windowSize } from "@/constants/windowSize";
import { useSaveData } from "./lib/save-data";
import hasCompletedIntroStep from "@/utils/hasCompletedIntroStep";
import NightOverlay from "@/components/intro/NightOverlay";
import GrandpaDialogue from "@/components/GrandpaDialogue";
import SunIntroChapter from "@/components/intro/sun/SunIntroChapter";

export default function HomeScreen() {
  const [saveData, setSaveData] = useSaveData();

  const hasCompletedSun = hasCompletedIntroStep("sun", saveData);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={"dark-content"} />
      <ImageBackground
        style={{ flex: 1, justifyContent: "center" }}
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
      {!hasCompletedSun && <SunIntroChapter />}
    </View>
  );
}
