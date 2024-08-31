import { View } from "react-native";

export type TileProps = {
  size: number;
  state: "empty" | "filled" | "crossed";
};

export default function Tile({ size, state }: TileProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: state === "filled" ? "black" : "white",
      }}
    />
  );
}
