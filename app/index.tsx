import { ImageBackground, StatusBar, View } from "react-native";
import ScrollingBackgroundImage from "@/src/components/ScrollingBackgroundImage";
import { windowSize } from "@/src/constants/windowSize";
import { useSaveData } from "@/src/lib/save-data";
import hasCompletedIntroStep from "@/src/utils/hasCompletedIntroStep";
import SunIntroChapter from "@/src/components/intro/sun/SunIntroChapter";
import BuildingsIntroChapter from "@/src/components/intro/buildings/BuildingsIntroChapter";
import House from "@/src/components/buildings/House";
import HousePlants from "@/src/components/buildings/HousePlants";
import FarmPlants from "@/src/components/buildings/FarmPlants";
import FarmLand from "@/src/components/buildings/FarmLand";
import FarmFence from "@/src/components/buildings/FarmFence";
import BottomMenu from "@/src/components/navigation/BottomMenu";

export default function HomeScreen() {
  const [saveData, setSaveData] = useSaveData();

  const hasCompletedHouse = hasCompletedIntroStep("house", saveData);
  const hasCompletedPlants = hasCompletedIntroStep("plants", saveData);
  const hasCompletedFarm = hasCompletedIntroStep("farm", saveData);

  const introChapter = (() => {
    const nextStep = saveData.introNextStep;
    switch (nextStep) {
      case "sun":
        return (
          <SunIntroChapter
            onComplete={() => {
              setSaveData("introNextStep", "house");
            }}
          />
        );
      case "house":
      case "plants":
      case "farm":
        return <BuildingsIntroChapter />;

      case null:
        return null;

      default:
        nextStep satisfies never;
        return null;
    }
  })();
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
        <House isVisible={hasCompletedHouse} x={180} y={200} dropDelay={2000} />
        <HousePlants
          isVisible={hasCompletedPlants}
          x={270}
          y={240}
          dropDelay={2000}
        />
        <FarmPlants
          isVisible={hasCompletedPlants}
          x={-100}
          y={400}
          dropDelay={2250}
        />
        <FarmFence
          isVisible={hasCompletedFarm}
          x={20}
          y={555}
          dropDelay={2000}
        />
        <FarmLand
          isVisible={hasCompletedFarm}
          x={35}
          y={620}
          dropDelay={2250}
        />
      </ImageBackground>
      {introChapter ?? <BottomMenu />}
    </View>
  );
}
