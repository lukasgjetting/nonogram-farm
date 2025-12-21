import BottomMenu from "@/src/components/interfaces/BottomMenu";
import Header from "@/src/components/store/Header";
import ItemSlots, { ITEM_SIZE } from "@/src/components/store/ItemSlots";
import Text from "@/src/components/Text";
import ValueChangeIndicator from "@/src/components/ValueChangeIndicator";
import { windowSize } from "@/src/constants/windowSize";
import {
  BuildingType,
  SaveData,
  UpdateSaveData,
  useSaveData,
} from "@/src/lib/save-data";
import { NavigationProp } from "@react-navigation/native";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  ImageSourcePropType,
  StatusBar,
  View,
} from "react-native";

const HEADER_WIDTH = windowSize.width * 1.2;
const HEADER_HEIGHT = HEADER_WIDTH / 2;

type ShopItem =
  | { id: "nonogram" }
  | { id: "extra-health" }
  | { id: "building"; type: BuildingType };

const SHOP_ITEMS: ({
  price: number;
  image: ImageSourcePropType;
  isAvailable: (saveData: SaveData) => boolean;
  onBuy: (opts: { saveData: SaveData; updateSaveData: UpdateSaveData }) => void;
} & ShopItem)[] = [
  {
    id: "nonogram",
    price: 100,
    image: require("@assets/images/nonogram-icons/seed.png"),
    isAvailable: () => true,
    onBuy: ({ saveData, updateSaveData }) => {
      updateSaveData("nonograms", (saveData.nonograms ?? 0) + 1);
    },
  },
  {
    id: "building",
    type: "art-gallery",
    price: 500,
    image: require("@assets/images/buildings/art-gallery.png"),
    isAvailable: (saveData) => !saveData.buildings["art-gallery"],
    onBuy: ({ saveData, updateSaveData }) => {
      updateSaveData("buildings", {
        ...saveData.buildings,
        "art-gallery": true,
      });
      router.back();
    },
  },
];

export default function ShopScreen() {
  const [saveData, updateSaveData] = useSaveData();
  const [boughtId, setBoughtId] = useState<string>();

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={"dark-content"} />
      <ImageBackground
        style={{ flex: 1, alignItems: "center", overflow: "hidden" }}
        imageStyle={{ resizeMode: "cover" }}
        source={require("@assets/images/shop-background.png")}
      >
        <Image
          source={require("@assets/images/shop-header.png")}
          style={{
            position: "absolute",
            zIndex: 2,
            left: -(HEADER_WIDTH - windowSize.width) / 2,
            top: -HEADER_HEIGHT / 2.25,
            width: HEADER_WIDTH,
            height: HEADER_HEIGHT,
            resizeMode: "contain",
          }}
        />
        <View style={{ zIndex: 5 }}>
          <Header>SHOP</Header>
        </View>
        <View style={{ flex: 1, alignSelf: "stretch" }}>
          <ItemSlots
            items={SHOP_ITEMS.filter((i) => i.isAvailable(saveData)).map(
              (i) => ({
                image: i.image,
                id: i.id,
                extra: { price: i.price, onBuy: i.onBuy },
              }),
            )}
            onPress={(item) => {
              const { price, onBuy } = item.extra;

              if (saveData.coins >= price) {
                updateSaveData("coins", saveData.coins - price);
                onBuy({ saveData, updateSaveData });
                setBoughtId(item.id);
              } else {
                Alert.alert(
                  "Not enough coins",
                  "You need more coins to buy this. Perhaps some farming will help?",
                );
              }
            }}
            renderExtra={(item) => (
              <View
                style={{
                  position: "absolute",
                  bottom: -12,
                  left: 0,
                  right: 0,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#2B2017",
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    gap: 4,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    font="semibold"
                    style={{
                      fontSize: 18,
                      textAlign: "center",
                      top: 2,
                      color: "#E4C8A7",
                    }}
                  >
                    {item.extra.price}
                  </Text>
                  <Image
                    source={require("@assets/images/icons/coins.png")}
                    style={{ width: 16, height: 16, resizeMode: "contain" }}
                  />
                </View>
                <ValueChangeIndicator
                  duration={500}
                  change={boughtId === item.id ? 1 : 0}
                  onComplete={() => setBoughtId(undefined)}
                  style={{ top: -12 - ITEM_SIZE / 2 }}
                />
              </View>
            )}
          />
        </View>
        <BottomMenu showBackButton />
      </ImageBackground>
    </View>
  );
}
