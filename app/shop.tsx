import BottomMenu from "@/src/components/interfaces/BottomMenu";
import Header from "@/src/components/store/Header";
import ItemSlots, { ITEM_SIZE } from "@/src/components/store/ItemSlots";
import Text from "@/src/components/Text";
import ValueChangeIndicator from "@/src/components/ValueChangeIndicator";
import { windowSize } from "@/src/constants/windowSize";
import { useSaveData } from "@/src/lib/save-data";
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
  | {
      id: "nonogram";
    }
  | {
      id: "extra-health";
    };

const SHOP_ITEMS: ({
  price: number;
  image: ImageSourcePropType;
} & ShopItem)[] = [
  {
    id: "nonogram",
    price: 100,
    image: require("@assets/images/nonogram-icons/seed.png"),
  },
];

export default function ShopScreen() {
  const [saveData, updateSaveData] = useSaveData();
  const [boughtId, setBoughtId] = useState<string>();

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
            items={SHOP_ITEMS.map((i) => ({
              image: i.image,
              id: i.id,
              extra: i.price,
            }))}
            onPress={(item) => {
              if (saveData.coins >= item.extra) {
                updateSaveData("coins", saveData.coins - item.extra);
                updateSaveData("nonograms", (saveData.nonograms ?? 0) + 1);
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
                    {item.extra}
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
