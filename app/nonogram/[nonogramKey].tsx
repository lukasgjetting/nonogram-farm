import {
  Animated,
  BackHandler,
  ImageBackground,
  useAnimatedValue,
  View,
} from "react-native";
import Nonogram from "@/src/components/nonogram/Nonogram";
import {
  NonogramKey,
  NonogramSources,
} from "@/src/constants/nonograms.generated";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useTransition } from "react";
import AnimatedLottieView from "lottie-react-native";
import { windowSize } from "@/src/constants/windowSize";
import ScrollingBackgroundImage from "@/src/components/ScrollingBackgroundImage";
import GameModal from "@/src/components/GameModal";
import Text from "@/src/components/Text";
import Button from "@/src/components/Button";
import { useSaveData } from "@/src/lib/save-data";
import GrandpaDialogue from "@/src/components/interfaces/GrandpaDialogue";
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

  const [showNonogram, setShowNonogram] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isPending, startTransition] = useTransition();
  const nonogramAnimatedValue = useAnimatedValue(showNonogram ? 1 : 0);

  useEffect(() => {
    setTimeout(() => {
      startTransition(() => setShowNonogram(true));
    }, 100);
  }, []);

  useEffect(() => {
    Animated.timing(nonogramAnimatedValue, {
      toValue: showNonogram ? 1 : 0,
      duration: 1000,
      delay: 500,
      useNativeDriver: true,
    }).start();
  }, [showNonogram, nonogramAnimatedValue]);

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
      setTimeout(() => {
        setHealth((prev) => prev - 1);
      }, 500);
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
        overflow: "hidden",
      }}
    >
      <ScrollingBackgroundImage
        source={require("@/assets/images/clouds.png")}
        aspectRatio={1.46}
        height={windowSize.height}
        speed={0.09}
      />
      <View>
        {showNonogram && (
          <Animated.View
            style={{
              opacity: nonogramAnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
              transform: [
                {
                  translateY: nonogramAnimatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [80, 0],
                  }),
                },
              ],
            }}
          >
            <Nonogram
              key={seed}
              maxHealth={MAX_HEALTH}
              currentHealth={health}
              srcKey={params.nonogramKey as NonogramKey}
              onGuessWrong={onGuessWrong}
              onComplete={onComplete}
              isCompleted={isCompleted}
            />
          </Animated.View>
        )}
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
          text={`Oh I love these! It's called a nonogram, and they're tons of fun!\n\nEach digit represents how many squares in that row or column must be filled in. If a single row or column has multiple digits, it means that the squares must be filled in that pattern, with at least one empty square between each group of filled squares.\n\nGood luck!\n\nOh, and don't forget that you earn rewards for every nonogram you complete!`}
          onComplete={() => setSaveData("hasCompletedNonogramTutorial", true)}
        />
      )}
    </ImageBackground>
  );
}
