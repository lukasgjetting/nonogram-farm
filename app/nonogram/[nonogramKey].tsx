import { BackHandler, ImageBackground, View } from "react-native";
import Nonogram from "@/src/components/nonogram/Nonogram";
import {
  NonogramKey,
  NonogramSources,
} from "@/src/constants/nonograms.generated";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import Health from "@/src/components/nonogram/Health";
import AnimatedLottieView from "lottie-react-native";
import { windowSize } from "@/src/constants/windowSize";
import ScrollingBackgroundImage from "@/src/components/ScrollingBackgroundImage";
import GameModal from "@/src/components/GameModal";
import Text from "@/src/components/Text";
import Button from "@/src/components/Button";
import { useSaveData } from "@/src/lib/save-data";
import GrandpaDialogue from "@/src/components/GrandpaDialogue";
import { onNonogramComplete } from "@/src/lib/nonogram-completion";

const MAX_HEALTH = 3;

export default function NonogramScreen() {
  const [saveData, setSaveData] = useSaveData();
  const hasCompletedTutorial = saveData.hasCompletedNonogramTutorial;

  const params = useLocalSearchParams<{ nonogramKey: string }>();
  const isValidKey = Object.keys(NonogramSources).includes(params.nonogramKey);

  const [seed, setSeed] = useState(Math.random());

  const [isCompleted, setIsCompleted] = useState(false);
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

  const onGuessWrong = () => {
    if (health === 0) {
      return;
    } else {
      setHealth((prev) => prev - 1);
    }
  };

  const onReset = () => {
    setHealth(MAX_HEALTH);
    setSeed(Math.random());
  };

  const onComplete = () => {
    setTimeout(() => setIsCompleted(true), 1000);

    setTimeout(() => {
      router.back();
      onNonogramComplete(params.nonogramKey as NonogramKey);
    }, 5000);
  };

  return (
    <ImageBackground
      source={require("@/assets/images/sky.png")}
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
        alignItems: "center",
      }}
    >
      <ScrollingBackgroundImage
        source={require("@/assets/images/clouds.png")}
        aspectRatio={1.46}
        height={windowSize.height}
        speed={0.15}
      />
      <Health maxHealth={MAX_HEALTH} currentHealth={health} />
      <View style={{ height: 8 }} />
      <View>
        <Nonogram
          key={seed}
          srcKey={params.nonogramKey as NonogramKey}
          onGuessWrong={onGuessWrong}
          onComplete={onComplete}
          isCompleted={isCompleted}
        />
        {isCompleted && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 20,
            }}
            pointerEvents="none"
          >
            <AnimatedLottieView
              source={require("@assets/animations/confetti.json")}
              autoPlay
              loop={false}
              style={{
                width: windowSize.width,
                height: windowSize.width,
              }}
            />
          </View>
        )}
      </View>
      <GameModal visible={health === 0} onClose={() => setHealth(MAX_HEALTH)}>
        <Text style={{ textAlign: "center", fontSize: 24, fontWeight: "bold" }}>
          Game over
        </Text>
        <View style={{ height: 16 }} />
        <Text style={{ textAlign: "center", fontSize: 16 }}>
          Want to try again?
        </Text>
        <View style={{ height: 24 }} />
        <Button type="primary" onPress={onReset}>
          Try again
        </Button>
        <Button type="link" onPress={() => router.back()}>
          Go back
        </Button>
      </GameModal>
      {!hasCompletedTutorial && (
        <GrandpaDialogue
          delay={1000}
          text={`Oh I love these! It's called a nonogram, and they're tons of fun!\n\nEach digit represents how many squares in that row or column must be filled in. If a single row or column has multiple digits, it means that the squares must be filled in that pattern, with at least one empty square between each group of filled squares.\n\nGood luck!`}
          onComplete={() => setSaveData("hasCompletedNonogramTutorial", true)}
        />
      )}
    </ImageBackground>
  );
}
