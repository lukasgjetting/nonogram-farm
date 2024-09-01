import { ImageBackground, StatusBar, View } from "react-native";
import ScrollingBackgroundImage from "@/src/components/ScrollingBackgroundImage";
import { windowSize } from "@/src/constants/windowSize";
import { useSaveData } from "@/src/lib/save-data";
import hasCompletedIntroStep from "@/src/utils/hasCompletedIntroStep";
import SunIntroChapter from "@/src/components/intro/sun/SunIntroChapter";

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
      {!hasCompletedSun && (
        <SunIntroChapter
          onComplete={() => setSaveData("introNextStep", "house")}
        />
      )}
    </View>
  );
}
