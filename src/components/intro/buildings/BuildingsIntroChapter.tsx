import { useSaveData } from "@/src/lib/save-data";
import GrandpaDialogue from "../../GrandpaDialogue";
import { useState } from "react";
import useMultiStepTiming from "@/src/utils/useMultiStepTiming";
import navigateToNonogramScreen from "@/src/utils/navigateToNonogramScreen";
import { Animated, StyleSheet, View } from "react-native";
import { windowSize } from "@/src/constants/windowSize";
import IntroNonogram from "./IntroNonogram";
import hasCompletedIntroStep from "@/src/utils/hasCompletedIntroStep";
import { useNonogramCompletionListener } from "@/src/lib/nonogram-completion";

type BuildingsIntroChapterProps = {};

export default function BuildingsIntroChapter(
  _props: BuildingsIntroChapterProps,
) {
  const [saveData, setSaveData] = useSaveData();

  const nextStep = saveData.introNextStep;
  const hasCompletedHouse = hasCompletedIntroStep("house", saveData);
  const hasCompletedPlants = hasCompletedIntroStep("plants", saveData);

  const [hasFinishedIntroDialogue, setHasFinishedIntroDialogue] =
    useState(hasCompletedHouse);

  const [hasFinishedNonograms, setHasFinishedNonograms] = useState(false);

  useNonogramCompletionListener("intro.house", () => {
    setSaveData("introNextStep", "plants");
  });

  useNonogramCompletionListener("intro.tree", () => {
    setSaveData("introNextStep", "farm");
  });

  useNonogramCompletionListener("intro.plant", () => {
    setHasFinishedNonograms(true);
  });

  const animatedValue = useMultiStepTiming({
    initialValue: 0,
    duration: 1000,
    steps: [[1, 1]],
    isActive: hasFinishedIntroDialogue,
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [windowSize.height * 0.3, 0],
  });

  return (
    <>
      {!hasFinishedIntroDialogue && (
        <GrandpaDialogue
          delay={1000}
          text={`Much better!\n\nUnfortunately, I'm all out of coffee.\n........................\n........................\n........................\n\nOh, right. You can have these.`}
          onComplete={() => setHasFinishedIntroDialogue(true)}
        />
      )}
      {hasFinishedNonograms && (
        <GrandpaDialogue
          delay={2000}
          text={`Wow, you're getting really good at these! And your farm is looking incredible!\n\nI'm sure you're ready to start planting some crops. If you ever need more seeds, the shop should be able to help you out. Just remember to bring coins!\n\nSee you later!`}
          onComplete={() => setSaveData("introNextStep", null)}
        />
      )}

      <View
        style={[
          StyleSheet.absoluteFill,
          {
            top: windowSize.height * 0.6,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          },
        ]}
      >
        <Animated.View
          style={{
            transform: [
              { translateY },
              {
                translateX: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [windowSize.width * 0.33, 0],
                }),
              },
            ],
          }}
        >
          <IntroNonogram
            type="building"
            status={
              hasCompletedHouse
                ? "completed"
                : nextStep === "house"
                  ? "available"
                  : "locked"
            }
            onPress={() => navigateToNonogramScreen("intro.house")}
          />
        </Animated.View>
        <Animated.View
          style={{
            transform: [{ translateY }],
          }}
        >
          <IntroNonogram
            type="tree"
            status={
              hasCompletedPlants
                ? "completed"
                : nextStep === "plants"
                  ? "available"
                  : "locked"
            }
            onPress={() => navigateToNonogramScreen("intro.tree")}
          />
        </Animated.View>
        <Animated.View
          style={{
            transform: [
              { translateY },
              {
                translateX: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-windowSize.width * 0.33, 0],
                }),
              },
            ],
          }}
        >
          <IntroNonogram
            type="seed"
            status={
              hasFinishedNonograms
                ? "completed"
                : nextStep === "farm"
                  ? "available"
                  : "locked"
            }
            onPress={() => navigateToNonogramScreen("intro.plant")}
          />
        </Animated.View>
      </View>
    </>
  );
}
