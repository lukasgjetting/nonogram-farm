import GrandpaDialogue from "@/components/GrandpaDialogue";
import NightOverlay from "../NightOverlay";
import useProgressionState from "@/utils/useProgressionState";
import { Animated, StyleSheet, View } from "react-native";
import NonogramIcon from "@/components/NonogramIcon";
import { windowSize } from "@/constants/windowSize";
import useMultiStepTiming from "@/utils/useMultiStepTiming";
import navigateToNonogramScreen from "@/utils/navigateToNonogramScreen";

const TOTAL_NONOGRAM_ANIMATION_DURATION = 3000;

export default function SunIntroChapter() {
  const {
    progress: [
      finishedGrandpaIntro,
      finishedNonogramAnimation,
      canPressNonogram,
    ],
    onProgress,
  } = useProgressionState();

  const nonogramY = useMultiStepTiming({
    initialValue: -windowSize.height * 0.6,
    steps: [
      [0.6, windowSize.height * 0.025],
      [1, 0],
    ],
    duration: TOTAL_NONOGRAM_ANIMATION_DURATION,
    isActive: finishedGrandpaIntro ?? false,
    onComplete: () => setTimeout(onProgress, 1000),
  });

  return (
    <>
      <NightOverlay />
      <GrandpaDialogue
        onComplete={onProgress}
        text={`Hi! Welcome to your brand new farm! My name is Otto and I am your new neighbour. I was planning to invite you for a cup of coffee in the sun, but it seems we missed the last sunlight.\n\nIf only there was a way to get it back...`}
      />
      {finishedGrandpaIntro && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Animated.View
            style={{
              transform: [{ translateY: nonogramY }],
            }}
          >
            <NonogramIcon
              type="sun"
              disabled={!canPressNonogram}
              onPress={() => navigateToNonogramScreen("intro.sun")}
            />
          </Animated.View>
        </View>
      )}
      {finishedNonogramAnimation && (
        <GrandpaDialogue
          onComplete={onProgress}
          text={`Oh! That looks like it might be helpful...\n\nPerhaps you should try investigating it?`}
        />
      )}
    </>
  );
}
