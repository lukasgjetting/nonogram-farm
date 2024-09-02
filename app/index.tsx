import { Image, StatusBar, StyleSheet, View } from "react-native";
import ScrollingBackgroundImage from "@/src/components/ScrollingBackgroundImage";
import { dx, dy, windowSize } from "@/src/constants/windowSize";
import { useSaveData } from "@/src/lib/save-data";
import hasCompletedIntroStep from "@/src/utils/hasCompletedIntroStep";
import SunIntroChapter from "@/src/components/intro/sun/SunIntroChapter";
import BuildingsIntroChapter from "@/src/components/intro/buildings/BuildingsIntroChapter";
import House from "@/src/components/buildings/House";
import HousePlants from "@/src/components/buildings/HousePlants";
import FarmPlants from "@/src/components/buildings/FarmPlants";
import FarmLand from "@/src/components/buildings/FarmLand";
import FarmFence from "@/src/components/buildings/FarmFence";
import BottomMenu from "@/src/components/interfaces/BottomMenu";

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
    <View style={{ flex: 1, backgroundColor: "blue" }}>
      <StatusBar barStyle={"dark-content"} />
      <View style={{ flex: 1 }}>
        <Image
          style={[
            StyleSheet.absoluteFill,
            {
              width: "100%",
              height: "100%",
              backgroundColor: "red",
              resizeMode: "stretch",
            },
          ]}
          source={require("@assets/images/farm-background.png")}
        />
        <View style={{ flex: 1 }}>
          <ScrollingBackgroundImage
            source={require("@/assets/images/clouds-small.png")}
            aspectRatio={6.4}
            speed={0.3}
            height={windowSize.height * 0.1}
          />
        </View>
        <House
          isVisible={hasCompletedHouse}
          x={dx(45)}
          y={dy(20)}
          dropDelay={2000}
        />
        <HousePlants
          isVisible={hasCompletedPlants}
          x={dx(62.8)}
          y={dy(25.75)}
          dropDelay={2000}
        />
        <FarmPlants
          isVisible={hasCompletedPlants}
          x={-dx(10) - dy(6)}
          y={dy(54.5) - dx(25)}
          dropDelay={2250}
        />
        <FarmFence
          isVisible={hasCompletedFarm}
          x={dx(4.65)}
          y={dy(65) - dx(11)}
          dropDelay={2000}
        />
        <FarmLand
          isVisible={hasCompletedFarm}
          x={dx(1) + dy(2.8)}
          y={dy(66.5)}
          dropDelay={2250}
        />
        {introChapter ?? <BottomMenu />}
      </View>
    </View>
  );
}
