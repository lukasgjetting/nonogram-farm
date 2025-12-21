import { dx } from "@/src/constants/windowSize";
import Building, { BuildingProps } from "./Building";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { TouchableOpacity } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import Text from "../Text";

export default function House(props: BuildingProps) {
  const [doorPresses, setDoorPresses] = useState(0);

  const onDoorPress = () => {
    setDoorPresses((prev) => {
      if (prev >= 4) {
        router.push("/dev-tools");
      }

      return prev + 1;
    });

    setTimeout(() => {
      setDoorPresses((prev) => prev - 1);
    }, 2000);
  };

  return (
    <Building
      {...props}
      source={require("@assets/images/buildings/house.png")}
      width={dx(48)}
      aspectRatio={1.221}
    >
      <TouchableOpacity
        onPress={onDoorPress}
        style={{
          position: "absolute",
          top: "50%",
          left: "15%",
          width: "15%",
          height: "40%",
        }}
      />
    </Building>
  );
}
