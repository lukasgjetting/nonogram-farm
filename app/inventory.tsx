import NewItemModal from "@/src/components/interfaces/NewItemModal";
import BottomMenu from "@/src/components/interfaces/BottomMenu";
import Header from "@/src/components/store/Header";
import ItemSlots, { Item } from "@/src/components/store/ItemSlots";
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
import QuantityIndicator from "@/src/components/QuantityIndicator";

const ELIGIBLE_SEED_NONOGRAMS = [
  "seeds.pineapple.pineapple",
  "seeds.pineapple.pineapple-slice",
  "seeds.pineapple.pina-colada",
  "seeds.tomato.tomato",
  "seeds.tomato.tomato-slice",
  "seeds.tomato.caprese",
  "seeds.carrot.carrot",
  "seeds.carrot.bunny",
  "seeds.carrot.carrot-field",
  "seeds.lettuce.lettuce",
  "seeds.lettuce.garden",
  "seeds.lettuce.cheeseburger",
] satisfies NonogramKey[];

type EligibleSeedNonogramKey = (typeof ELIGIBLE_SEED_NONOGRAMS)[number];

const SEED_BY_NONOGRAM_KEY: Record<EligibleSeedNonogramKey, SeedType> = {
  "seeds.pineapple.pineapple": "pineapple",
  "seeds.pineapple.pineapple-slice": "pineapple",
  "seeds.pineapple.pina-colada": "pineapple",
  "seeds.tomato.tomato": "tomato",
  "seeds.tomato.tomato-slice": "tomato",
  "seeds.tomato.caprese": "tomato",
  "seeds.carrot.carrot": "carrot",
  "seeds.carrot.bunny": "carrot",
  "seeds.carrot.carrot-field": "carrot",
  "seeds.lettuce.lettuce": "lettuce",
  "seeds.lettuce.garden": "lettuce",
  "seeds.lettuce.cheeseburger": "lettuce",
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
      .filter(([seed, count]) => count > 0 && seed !== "undefined")
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
                  `Can be planted in your farm.\n\nTakes ${formatTimeLabel(SEED_GROWTH_TIME[seedType])} to grow`,
                );
              }
            }}
            renderExtra={(item) => (
              <QuantityIndicator
                quantity={item.extra}
                style={{ position: "absolute", top: -8, right: -2 }}
              />
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
