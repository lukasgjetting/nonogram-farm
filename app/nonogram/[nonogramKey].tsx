import { BackHandler, ImageBackground, View } from "react-native";
import Nonogram from "@/components/nonogram/Nonogram";
import { NonogramKey, NonogramSources } from "@/constants/nonograms.generated";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import Health from "@/components/nonogram/Health";
import AnimatedLottieView from "lottie-react-native";
import { windowSize } from "@/constants/windowSize";
import ScrollingBackgroundImage from "@/components/ScrollingBackgroundImage";
import GameModal from "@/components/GameModal";
import Text from "@/components/Text";
import Button from "@/components/Button";

const MAX_HEALTH = 3;

export default function NonogramScreen() {
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
              source={require("../../assets/animations/confetti.json")}
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
    </ImageBackground>
  );
}
