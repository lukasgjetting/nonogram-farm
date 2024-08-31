import { NonogramKey, NonogramSources } from "@/constants/nonograms.generated";
import { useEffect, useState } from "react";
import { View } from "react-native";
import * as Haptics from "expo-haptics";
import Tile from "./Tile";
import HorizontalAxis from "./HorizontalAxis";
import VerticalAxis from "./VerticalAxis";
import getRowHeaderDigits from "./utils/getRowHeaderDigits";
import useNonogramPanResponder from "./utils/useNonogramPanResponder";
import { windowSize } from "@/constants/windowSize";

export const DEFAULT_NONOGRAM_MARGIN = 16;
export const FULLSCREEN_NONOGRAM_SIZE =
  windowSize.width - DEFAULT_NONOGRAM_MARGIN * 2;

export const TILE_GAP = 2;
export const HEADER_DIGIT_SIZE = 25;

export type TileMap = boolean[][];

const getTileMapFromSrcKey = (srcKey: NonogramKey) => {
  const rawTileMap = NonogramSources[srcKey];
  return rawTileMap
    .split("\n")
    .map((line) => line.split("").map((tile) => tile === "x"));
};

export type NonogramProps = {
  srcKey: NonogramKey;
  onGuessWrong: () => void;
  onComplete: () => void;
};

export default function Nonogram({
  srcKey,
  onGuessWrong,
  onComplete,
}: NonogramProps) {
  const [revealedTiles, setRevealedTiles] = useState<TileMap>([]);
  const [tileMap, setTileMap] = useState<TileMap>(() =>
    getTileMapFromSrcKey(srcKey),
  );

  const rowsCompleted = tileMap.map((row, rowIndex) =>
    row.every(
      (_col, colIndex) =>
        tileMap[rowIndex]![colIndex] === false ||
        (revealedTiles[rowIndex]?.[colIndex] ?? false),
    ),
  );
  const columnsCompleted = new Array(
    Math.max(...tileMap.map((row) => row.length)),
  )
    .fill(null)
    .map((_, colIndex) =>
      tileMap.every(
        (_row, rowIndex) =>
          tileMap[rowIndex]![colIndex] === false ||
          (revealedTiles[rowIndex]?.[colIndex] ?? false),
      ),
    );

  useEffect(() => {
    setTileMap(getTileMapFromSrcKey(srcKey));
    setRevealedTiles([]);
  }, [srcKey]);

  const revealTile = (rowIndex: number, columnIndex: number) => {
    // If out of bounds, do nothing
    if (tileMap[rowIndex]?.[columnIndex] == null) {
      return true;
    }

    // If row or column is completed, do nothing
    if (rowsCompleted[rowIndex] || columnsCompleted[columnIndex]) {
      return true;
    }

    let isAlreadyRevealed = false;

    setRevealedTiles((prev) => {
      if (prev[rowIndex]?.[columnIndex]) {
        isAlreadyRevealed = true;
        return prev;
      }

      const newRevealedTiles = [...prev];

      if (newRevealedTiles[rowIndex] == null) {
        newRevealedTiles[rowIndex] = [];
      } else {
        newRevealedTiles[rowIndex] = [...newRevealedTiles[rowIndex]];
      }

      newRevealedTiles[rowIndex][columnIndex] = true;

      return newRevealedTiles;
    });

    const isCorrect = tileMap[rowIndex]?.[columnIndex] ?? false;

    if (isAlreadyRevealed) {
      return isCorrect;
    }

    if (!isCorrect) {
      onGuessWrong();
    }

    Haptics.impactAsync(
      isCorrect
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Heavy,
    );
    // If every correct tile is revealed, the game is complete
    if (
      tileMap.every((row, rIndex) =>
        row.every(
          (tile, cIndex) =>
            (rIndex === rowIndex && cIndex === columnIndex) ||
            tile === false ||
            (revealedTiles[rIndex]?.[cIndex] ?? false),
        ),
      )
    ) {
      onComplete();
    }

    return isCorrect;
  };

  console.log(
    "iscomewra",
    tileMap.every((row, rIndex) =>
      row.every((tile, cIndex) => {
        if (tile === false || (revealedTiles[rIndex]?.[cIndex] ?? false)) {
        } else {
          console.log("incomplete!", { rIndex, cIndex });
        }

        return tile === false || (revealedTiles[rIndex]?.[cIndex] ?? false);
      }),
    ),
  );

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

  const panResponder = useNonogramPanResponder({
    tileSize,
    tileGap: TILE_GAP,
    onRevealTile: revealTile,
  });

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
              padding: TILE_GAP,
              backgroundColor: "#f0f0f0",
            }}
            {...panResponder.panHandlers}
          >
            <View
              style={{
                gap: TILE_GAP,
              }}
              pointerEvents="none"
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
                        key={columnIndex}
                        size={tileSize}
                        rowIndex={rowIndex}
                        columnIndex={columnIndex}
                        isRowCompleted={rowsCompleted[rowIndex] ?? false}
                        isColumnCompleted={
                          columnsCompleted[columnIndex] ?? false
                        }
                        state={
                          isRevealed
                            ? tileValue
                              ? "filled"
                              : "crossed"
                            : "empty"
                        }
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
