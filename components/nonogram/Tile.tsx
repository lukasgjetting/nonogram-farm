import { Image, Pressable, View } from "react-native";

export type TileProps = {
  size: number;
  state: "empty" | "filled" | "crossed";
};

const FILLED_COLOR = "black";
const EMPTY_COLOR = "white";
const CROSS_COLOR = "red";

export default function Tile({ size, state }: TileProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: state === "filled" ? FILLED_COLOR : EMPTY_COLOR,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPointerEnter={() => {
        console.log("pointer enter");
      }}
    >
      {state === "crossed" && (
        <Image
          source={require("../../assets/images/icons/xmark.png")}
          style={{
            width: size * 0.5,
            height: size * 0.5,
            tintColor: CROSS_COLOR,
          }}
        />
      )}
    </View>
  );
}
