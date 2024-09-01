import GrandpaDialogue from "@/src/components/GrandpaDialogue";
import NightOverlay from "./NightOverlay";
import useProgressionState from "@/src/utils/useProgressionState";
import { Animated, StyleSheet, View } from "react-native";
import NonogramIcon from "@/src/components/NonogramIcon";
import { windowSize } from "@/src/constants/windowSize";
import useMultiStepTiming from "@/src/utils/useMultiStepTiming";
import navigateToNonogramScreen from "@/src/utils/navigateToNonogramScreen";
import { useNonogramCompletionListener } from "@/src/lib/nonogram-completion";
import { useState } from "react";

const TOTAL_NONOGRAM_ANIMATION_DURATION = 3000;

type SunIntroChapterProps = {
  onComplete: () => void;
};

export default function SunIntroChapter({ onComplete }: SunIntroChapterProps) {
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

  const [isNonogramComplete, setIsNonogramComplete] = useState(false);

  useNonogramCompletionListener("intro.sun", () => {
    setTimeout(() => {
      setIsNonogramComplete(true);
    }, 2000);

    setTimeout(() => {
      onComplete();
    }, 2000);
  });

  return (
    <>
      <NightOverlay isVisible={!isNonogramComplete} />
      <GrandpaDialogue
        onComplete={onProgress}
        delay={1000}
        text={`Hi! Welcome to your brand new farm!\n\nMy name is Otto and I am your new neighbour. I was planning to invite you for a cup of coffee in the sun, but it seems we missed the last sunlight.\n\nIf only there was a way to get it back...`}
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
