import { NonogramKey, NonogramSources } from "@/constants/nonograms.generated";
import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import Tile from "./Tile";
import HorizontalAxis from "./HorizontalAxis";
import VerticalAxis from "./VerticalAxis";
import getRowHeaderDigits from "./utils/getRowHeaderDigits";

export const DEFAULT_NONOGRAM_MARGIN = 16;
export const FULLSCREEN_NONOGRAM_SIZE =
  Dimensions.get("window").width - DEFAULT_NONOGRAM_MARGIN * 2;

export const TILE_GAP = 2;
export const HEADER_DIGIT_SIZE = 25;

export type TileMap = boolean[][];

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
  const [revealedTiles, setRevealedTiles] = useState<TileMap>([]);
  const [tileMap, setTileMap] = useState<TileMap>(() =>
    getTileMapFromSrcKey(srcKey),
  );

  useEffect(() => {
    setTileMap(getTileMapFromSrcKey(srcKey));
  }, [srcKey]);

  const revealTile = (rowIndex: number, columnIndex: number) => {
    setRevealedTiles((prev) => {
      const newRevealedTiles = [...prev];

      if (newRevealedTiles[rowIndex] == null) {
        newRevealedTiles[rowIndex] = [];
      } else {
        newRevealedTiles[rowIndex] = [...newRevealedTiles[rowIndex]];
      }

      newRevealedTiles[rowIndex][columnIndex] = true;

      return newRevealedTiles;
    });
  };

  const verticalHeader = tileMap.map((row) => getRowHeaderDigits(row));
  const horizontalHeader = new Array(
    Math.max(...tileMap.map((row) => row.length)),
  )
    .fill(null)
    .map((_, index) =>
      getRowHeaderDigits(tileMap.map((row) => row[index] ?? false)),
    );

  const maxVerticalHeaderDigits = Math.max(
    ...verticalHeader.map((row) => row.length),
  );
  const verticalHeaderWidth =
    maxVerticalHeaderDigits * HEADER_DIGIT_SIZE +
    (maxVerticalHeaderDigits + 1) * TILE_GAP;
  const tilesInRow = tileMap[0]?.length ?? 0;
  const tileSize =
    (FULLSCREEN_NONOGRAM_SIZE -
      verticalHeaderWidth -
      (tilesInRow + 1) * TILE_GAP) /
    tilesInRow;

  return (
    <View
      style={{
        margin: DEFAULT_NONOGRAM_MARGIN,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <VerticalAxis
          digitSize={HEADER_DIGIT_SIZE}
          tileGap={TILE_GAP}
          digits={verticalHeader}
          tileSize={tileSize}
        />
        <View>
          <HorizontalAxis
            digitSize={HEADER_DIGIT_SIZE}
            tileGap={TILE_GAP}
            digits={horizontalHeader}
            tileSize={tileSize}
          />
          <View
            style={{
              gap: TILE_GAP,
              padding: TILE_GAP,
              backgroundColor: "#f0f0f0",
            }}
          >
            {tileMap?.map((row, rowIndex) => (
              <View
                key={rowIndex}
                style={{ flexDirection: "row", gap: TILE_GAP }}
              >
                {row.map((tileValue, columnIndex) => {
                  const isRevealed =
                    revealedTiles[rowIndex]?.[columnIndex] ?? false;
                  return (
                    <Tile
                      size={tileSize}
                      key={columnIndex}
                      state={
                        isRevealed
                          ? tileValue
                            ? "filled"
                            : "crossed"
                          : "empty"
                      }
                      onPress={() => revealTile(rowIndex, columnIndex)}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
