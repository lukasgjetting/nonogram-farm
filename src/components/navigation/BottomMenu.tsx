import { useSaveData } from "@/src/lib/save-data";
import { Image, ImageBackground, TouchableOpacity, View } from "react-native";
import Text from "../Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { windowSize } from "@/src/constants/windowSize";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import ValueChangeIndicator from "../ValueChangeIndicator";

const BUTTON_SIZE = windowSize.width / 4.5;

export default function BottomMenu() {
  const [{ coins, points }] = useSaveData();
  const insets = useSafeAreaInsets();

  const lastCoins = useRef(coins);
  const lastPoints = useRef(points);

  const [coinsChange, setCoinsChange] = useState(0);
  const [pointsChange, setPointsChange] = useState(0);

  useEffect(() => {
    if (coins !== lastCoins.current) {
      setCoinsChange(coins - lastCoins.current);
      lastCoins.current = coins;
    }

    if (points !== lastPoints.current) {
      setPointsChange(points - lastPoints.current);
      lastPoints.current = points;
    }
  }, [coins, points]);

  return (
    <View
      style={{
        paddingBottom: insets.bottom + 8,
        paddingHorizontal: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 24,
      }}
    >
      <View style={{ alignItems: "center", flex: 1 }}>
        <ImageBackground
          source={require("@/assets/images/progress-background.png")}
          style={{
            padding: 12,
            borderRadius: 16,
            overflow: "hidden",
            gap: 4,
          }}
        >
          <ImageBackground
            source={require("@/assets/images/progress-line-background.png")}
            imageStyle={{ resizeMode: "stretch" }}
            style={{
              padding: 8,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 8,
            }}
          >
            <View style={{ minWidth: 80 }}>
              <Text style={{ textAlign: "right", fontSize: 18, top: 2 }}>
                {coins ?? 0}
              </Text>
              <ValueChangeIndicator
                change={coinsChange}
                onComplete={() => setCoinsChange(0)}
              />
            </View>
            <Image
              source={require("@/assets/images/icons/coins.png")}
              style={{ width: 20, height: 20, resizeMode: "contain" }}
            />
          </ImageBackground>
          <ImageBackground
            source={require("@/assets/images/progress-line-background.png")}
            imageStyle={{ resizeMode: "stretch" }}
            style={{
              padding: 8,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 8,
            }}
          >
            <View style={{ minWidth: 80 }}>
              <Text style={{ textAlign: "right", fontSize: 18, top: 2 }}>
                {points ?? 0}
              </Text>
              <ValueChangeIndicator
                change={pointsChange}
                onComplete={() => setPointsChange(0)}
              />
            </View>
            <Image
              source={require("@/assets/images/icons/points.png")}
              style={{ width: 20, height: 20, resizeMode: "contain" }}
            />
          </ImageBackground>
        </ImageBackground>
      </View>
      <View
        style={{
          flex: 1.25,
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.navigate("/shop")}
        >
          <Image
            source={require("@/assets/images/shop-button.png")}
            style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.navigate("/inventory")}
        >
          <Image
            source={require("@/assets/images/inventory-button.png")}
            style={{ width: BUTTON_SIZE, height: BUTTON_SIZE }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
