import { NonogramKey, NonogramSources } from "@/constants/nonograms.generated";
import { useEffect, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import Tile from "./Tile";

export const DEFAULT_NONOGRAM_MARGIN = 32;
export const FULLSCREEN_NONOGRAM_SIZE =
  Dimensions.get("window").width - DEFAULT_NONOGRAM_MARGIN * 2;

export const TILE_GAP = 2;

export type NonogramProps = {
  srcKey: NonogramKey;
};

const getTileMapFromSrcKey = (srcKey: NonogramKey) => {
  const rawTileMap = NonogramSources[srcKey];
  return rawTileMap
    .split("\n")
    .map((line) => line.split("").map((tile) => tile === "x"));
};

export default function Nonogram({ srcKey }: NonogramProps) {
  const [tileMap, setTileMap] = useState<boolean[][]>(() =>
    getTileMapFromSrcKey(srcKey),
  );

  useEffect(() => {
    setTileMap(getTileMapFromSrcKey(srcKey));
  }, [srcKey]);

  const tilesInRow = tileMap[0].length;
  const tileSize =
    (FULLSCREEN_NONOGRAM_SIZE - (tilesInRow + 1) * TILE_GAP) / tilesInRow;

  return (
    <View
      style={{
        margin: DEFAULT_NONOGRAM_MARGIN,
        gap: TILE_GAP,
        padding: TILE_GAP,
        backgroundColor: "#f0f0f0",
      }}
    >
      {tileMap?.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: "row", gap: TILE_GAP }}>
          {row.map((tile, tileIndex) => (
            <Tile
              size={tileSize}
              key={tileIndex}
              state={tile ? "filled" : "empty"}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
