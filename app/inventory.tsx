import NewItemModal from "@/src/components/interfaces/NewItemModal";
import BottomMenu from "@/src/components/interfaces/BottomMenu";
import Header from "@/src/components/store/Header";
import ItemSlots, { Item } from "@/src/components/store/ItemSlots";
import Text from "@/src/components/Text";
import { NonogramKey } from "@/src/constants/nonograms.generated";
import {
  SEED_BAG_IMAGES,
  SEED_GROWTH_TIME,
  SEED_LABELS,
  SeedType,
} from "@/src/constants/seeds";
import { useNonogramCompletionListener } from "@/src/lib/nonogram-completion";
import { useSaveData } from "@/src/lib/save-data";
import navigateToNonogramScreen from "@/src/utils/navigateToNonogramScreen";
import { useState } from "react";
import { Alert, ImageBackground, StatusBar, View } from "react-native";
import formatTimeLabel from "@/src/utils/formatTimeLabel";

const ELIGIBLE_SEED_NONOGRAMS = [
  "intro.house",
  "intro.sun",
  "intro.simple",
  "intro.tree",
] satisfies NonogramKey[];

type EligibleSeedNonogramKey = (typeof ELIGIBLE_SEED_NONOGRAMS)[number];

const SEED_BY_NONOGRAM_KEY: Record<EligibleSeedNonogramKey, SeedType> = {
  "intro.house": "lettuce",
  "intro.sun": "carrot",
  "intro.simple": "tomato",
  "intro.tree": "pineapple",
};

export default function InventoryScreen() {
  const [saveData, updateSaveData] = useSaveData();

  const [currentNonogram, setCurrentNonogram] =
    useState<EligibleSeedNonogramKey>();
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
              } else {
                const seedType = item.id as SeedType;
                Alert.alert(
                  `${SEED_LABELS[seedType]} seed`,
                  `Takes ${formatTimeLabel(SEED_GROWTH_TIME[seedType])} to grow`,
                );
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
              </>
            )}
          />
        </View>
        <BottomMenu showBackButton />
        <NewItemModal
          visible={hasCompletedNonogram && currentNonogram != null}
          imageSource={
            SEED_BAG_IMAGES[SEED_BY_NONOGRAM_KEY[currentNonogram!]!]!
          }
          imageHeight={100}
          imageWidth={100}
          onClose={() => {
            setCurrentNonogram(undefined);
            setHasCompletedNonogram(false);
          }}
        />
      </ImageBackground>
    </View>
  );
}
