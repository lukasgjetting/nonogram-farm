import { useSaveData } from "@/src/lib/save-data";
import Building, { BuildingProps } from "./Building";
import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  useAnimatedValue,
  View,
} from "react-native";
import SeedOptionsModal from "../interfaces/SeedOptionsModal";
import {
  PlantedSeed,
  SEED_GROWTH_TIME,
  SEED_STAGE_IMAGES,
} from "@/src/constants/seeds";
import getSeedStage from "@/src/utils/getSeedStage";
import useHarvest from "@/src/utils/useHarvest";
import useSeedGrowthUpdate from "@/src/utils/useSeedGrowthUpdate";
import formatTimeLabel from "@/src/utils/formatTimeLabel";

const ASPECT_RATIO = 1.221;
const WIDTH = 85;
const HEIGHT = WIDTH / ASPECT_RATIO;

const FARM_LANDS_HORIZONTAL = 3;
const FARM_LANDS_VERTICAL = 2;

const getHorizontalOffset = (pos: { x: number; y: number }) =>
  pos.x * 0.62 * WIDTH + pos.y * 0.38 * WIDTH;
const getVerticalOffset = (pos: { x: number; y: number }) =>
  pos.x * -0.204 * HEIGHT + pos.y * 0.275 * HEIGHT;

const getSeedImage = (seed: PlantedSeed | null) => {
  if (seed == null) {
    return null;
  }

  const stage = getSeedStage(seed);

  return SEED_STAGE_IMAGES[seed.type]![stage]!;
};

const renderAllFarmLands = (props: BuildingProps, seed: PlantedSeed | null) => {
  let renderedFarmLands = 0;

  const seedImage = getSeedImage(seed);

  const renderSingleFarmLand = (pos: { x: number; y: number }) => {
    const delay = (props.dropDelay ?? 0) + renderedFarmLands * 150;

    renderedFarmLands += 1;

    return (
      <Building
        key={`${pos.x}-${pos.y}`}
        {...props}
        dropDelay={delay}
        source={require("@assets/images/buildings/farm-land.png")}
        width={WIDTH}
        aspectRatio={ASPECT_RATIO}
        x={getHorizontalOffset(pos)}
        y={getVerticalOffset(pos)}
      >
        {seedImage != null && (
          <View
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={seedImage.source}
              style={{
                resizeMode: "contain",
                top: (-WIDTH * (seedImage.heightPercentage / 100)) / 4,
                width: `${seedImage.widthPercentage}%`,
                height: `${seedImage.heightPercentage}%`,
              }}
            />
          </View>
        )}
      </Building>
    );
  };

  return (
    <>
      {new Array(FARM_LANDS_VERTICAL)
        .fill(null)
        .map((_, y) =>
          new Array(FARM_LANDS_HORIZONTAL)
            .fill(null)
            .map((_, x) => renderSingleFarmLand({ x, y })),
        )}
    </>
  );
};

export default function FarmLand(props: BuildingProps) {
  const [{ plantedSeed }, updateSaveData] = useSaveData();
  const harvest = useHarvest();

  const pulseAnimatedValue = useAnimatedValue(0);

  const [isSeedMenuOpen, setIsSeedMenuOpen] = useState(false);

  useSeedGrowthUpdate(plantedSeed);

  useEffect(() => {
    pulseAnimatedValue.stopAnimation();
    pulseAnimatedValue.setValue(0);

    if (plantedSeed != null) {
      return;
    }

    Animated.loop(
      Animated.timing(pulseAnimatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
  }, [plantedSeed, pulseAnimatedValue]);

  const maxXOffset = getHorizontalOffset({
    x: FARM_LANDS_HORIZONTAL - 1,
    y: FARM_LANDS_VERTICAL - 1,
  });
  const maxYOffset = getVerticalOffset({ x: 0, y: FARM_LANDS_VERTICAL - 1 });

  const plantedSeedStage =
    plantedSeed != null ? getSeedStage(plantedSeed) : null;

  const onPress = () => {
    switch (plantedSeedStage) {
      case null:
        setIsSeedMenuOpen(true);
        break;

      case 0:
      case 1:
      case 2: {
        const growingMilliseconds = Date.now() - plantedSeed!.plantedAt;

        Alert.alert(
          "Your seed is still growing",
          `It will be ready in ${formatTimeLabel(SEED_GROWTH_TIME[plantedSeed!.type]! - growingMilliseconds)}.`,
        );
        break;
      }

      case 3:
        harvest();
        break;
    }
  };

  return (
    <>
      <Animated.View
        style={{
          position: "absolute",
          left: props.x,
          top: props.y,
          width: maxXOffset + WIDTH,
          height: maxYOffset + HEIGHT,
          transform: [
            {
              scale: pulseAnimatedValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 1.025, 1],
              }),
            },
          ],
        }}
      >
        {renderAllFarmLands({ ...props, x: 0, y: 0 }, plantedSeed)}
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onPress} />
      </Animated.View>
      <SeedOptionsModal
        visible={isSeedMenuOpen}
        onClose={() => setIsSeedMenuOpen(false)}
        onSelect={(seed) => {
          updateSaveData("plantedSeed", { type: seed, plantedAt: Date.now() });
        }}
      />
    </>
  );
}
