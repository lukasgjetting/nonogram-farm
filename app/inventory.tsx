import BottomMenu from "@/src/components/navigation/BottomMenu";
import Header from "@/src/components/store/Header";
import ItemSlots, { Item } from "@/src/components/store/ItemSlots";
import Text from "@/src/components/Text";
import ValueChangeIndicator from "@/src/components/ValueChangeIndicator";
import { NonogramKey } from "@/src/constants/nonograms.generated";
import { SEED_BAG_IMAGES, SeedType } from "@/src/constants/seeds";
import { useNonogramCompletionListener } from "@/src/lib/nonogram-completion";
import { useSaveData } from "@/src/lib/save-data";
import navigateToNonogramScreen from "@/src/utils/navigateToNonogramScreen";
import { router } from "expo-router";
import { useState } from "react";
import { ImageBackground, StatusBar, View } from "react-native";

const ELIGIBLE_SEED_NONOGRAMS = [
  "intro.house",
  "intro.sun",
] satisfies NonogramKey[];

const SEED_BY_NONOGRAM_KEY: Record<NonogramKey, SeedType> = {
  "intro.house": "lettuce",
  "intro.sun": "carrot",
  "intro.simple": "tomato",
  "intro.tree": "pineapple",
};

export default function InventoryScreen() {
  const [saveData, updateSaveData] = useSaveData();

  const [currentNonogram, setCurrentNonogram] = useState<NonogramKey>();
  const [hasCompletedNonogram, setHasCompletedNonogram] = useState(false);

  useNonogramCompletionListener(currentNonogram, () => {
    const seed = SEED_BY_NONOGRAM_KEY[currentNonogram!];

    updateSaveData("nonograms", saveData.nonograms - 1);
    updateSaveData("seeds", {
      ...saveData.seeds,
      [seed]: (saveData.seeds[seed] ?? 0) + 1,
    });
    setHasCompletedNonogram(true);
  });

  const onPressNonogram = () => {
    const randomIndex = Math.floor(
      Math.random() * ELIGIBLE_SEED_NONOGRAMS.length,
    );

    const key = ELIGIBLE_SEED_NONOGRAMS[randomIndex]!;

    setCurrentNonogram(key);
    navigateToNonogramScreen(key);
  };

  const items: Item<number>[] = [
    ...(saveData.nonograms > 0
      ? [
          {
            id: "nonograms",
            image: require("@assets/images/nonogram-icons/seed.png"),
            extra: saveData.nonograms,
          },
        ]
      : []),
    ...Object.entries(saveData.seeds)
      .filter(([_seed, count]) => count > 0)
      .map(([seed, count]) => ({
        id: seed,
        image: SEED_BAG_IMAGES[seed as SeedType],
        extra: count,
      })),
  ];

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={"dark-content"} />
      <ImageBackground
        style={{
          flex: 1,
          alignItems: "center",
          overflow: "hidden",
        }}
        imageStyle={{ resizeMode: "cover" }}
        source={require("@assets/images/shop-background.png")}
      >
        <Header>INVENTORY</Header>
        <View style={{ flex: 1, alignSelf: "stretch" }}>
          <ItemSlots
            items={items}
            onPress={(item) => {
              if (item.id === "nonograms") {
                onPressNonogram();
              }
            }}
            renderExtra={(item) => (
              <>
                <ImageBackground
                  source={require("@assets/images/progress-background.png")}
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -2,
                    borderRadius: 100,
                    overflow: "hidden",
                    height: 24,
                    width: 24,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: "center",
                      top: 4,
                    }}
                  >
                    {item.extra}
                  </Text>
                </ImageBackground>
                <ValueChangeIndicator
                  change={1}
                  onComplete={() => {
                    setHasCompletedNonogram(false);
                    setCurrentNonogram(undefined);
                  }}
                />
              </>
            )}
          />
        </View>
        <BottomMenu showBackButton />
      </ImageBackground>
    </View>
  );
}
