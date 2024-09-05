import {
  getNonogramTileMap,
  NonogramKey,
} from "@/src/constants/nonograms.generated";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import Tile from "./Tile";
import getRowHeaderDigits from "./utils/getRowHeaderDigits";
import useNonogramPanResponder from "./utils/useNonogramPanResponder";
import { windowSize } from "@/src/constants/windowSize";
import Axis from "./Axis";
import ColoredMotive from "./ColoredMotive";
import CompletedName from "./CompletedName";
import SectionLine from "./SectionLine";
import PutCrossesToggle from "./PutCrossesToggle";

const MAX_NONOGRAM_SIZE = 700;
const MIN_MONOGRAM_MARGIN = 16;
export const DEFAULT_NONOGRAM_MARGIN = Math.max(
  MIN_MONOGRAM_MARGIN,
  (windowSize.width - MAX_NONOGRAM_SIZE) / 2,
);

export const FULLSCREEN_NONOGRAM_SIZE =
  windowSize.width - DEFAULT_NONOGRAM_MARGIN * 2;

const TILE_GAP = 2;

const HEADER_DIGIT_SIZE = 18;

export type TileMap = boolean[][];

export type NonogramProps = {
  srcKey: NonogramKey;
  onGuessWrong: () => void;
  onComplete: () => void;
  isCompleted: boolean;
};

const getSectionSize = (size: number) => {
  if (size % 5 === 0) {
    return 5;
  }

  if (size % 4 === 0) {
    return 4;
  }

  if (size % 3 === 0) {
    return 3;
  }

  return 0;
};

export default function Nonogram({
  srcKey,
  onGuessWrong,
  onComplete,
  isCompleted,
}: NonogramProps) {
  const [isPuttingCrosses, setIsPuttingCrosses] = useState(false);
  const [revealedTiles, setRevealedTiles] = useState<TileMap>([]);
  const [tileMap, setTileMap] = useState<TileMap>(() =>
    getNonogramTileMap(srcKey),
  );

  const isPuttingCrossesRef = useRef(isPuttingCrosses);

  if (isPuttingCrossesRef.current !== isPuttingCrosses) {
    isPuttingCrossesRef.current = isPuttingCrosses;
  }

  const getIsPuttingCrosses = useCallback(
    () => isPuttingCrossesRef.current,
    [],
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

  const completedRowIndexes = useMemo(
    () =>
      rowsCompleted
        .map((completed, index) => (completed ? index : null))
        .filter((index) => index != null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...rowsCompleted],
  );
  const completedColumnIndexes = useMemo(
    () =>
      columnsCompleted
        .map((completed, index) => (completed ? index : null))
        .filter((index) => index != null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...columnsCompleted],
  );

  useEffect(() => {
    setTileMap(getNonogramTileMap(srcKey));
    setRevealedTiles([]);
  }, [srcKey]);

  const revealTile = (rowIndex: number, columnIndex: number) => {
    // If game is completed, do nothing
    if (isCompleted) {
      return false;
    }

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

    const shouldBeFilled = tileMap[rowIndex]?.[columnIndex] ?? false;
    const isCorrect = shouldBeFilled === !isPuttingCrosses;

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

  const verticalHeader = useMemo(
    () => tileMap.map((row) => getRowHeaderDigits(row)),
    [tileMap],
  );
  const horizontalHeader = useMemo(
    () =>
      new Array(Math.max(...tileMap.map((row) => row.length)))
        .fill(null)
        .map((_, index) =>
          getRowHeaderDigits(tileMap.map((row) => row[index] ?? false)),
        ),
    [tileMap],
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

  const horizontalSectionSize = getSectionSize(tilesInRow);
  const verticalSectionSize = getSectionSize(tileMap.length);

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
        <Axis
          direction="vertical"
          completedIndexes={completedRowIndexes}
          digitSize={HEADER_DIGIT_SIZE}
          tileGap={TILE_GAP}
          allDigits={verticalHeader}
          tileSize={tileSize}
        />
        <View>
          <Axis
            direction="horizontal"
            completedIndexes={completedColumnIndexes}
            digitSize={HEADER_DIGIT_SIZE}
            tileGap={TILE_GAP}
            allDigits={horizontalHeader}
            tileSize={tileSize}
          />
          <View>
            <View
              style={{
                padding: TILE_GAP,
                backgroundColor: "#f0f0f0",
                overflow: "hidden",
              }}
              {...panResponder.panHandlers}
            >
              {horizontalSectionSize > 0 &&
                new Array(Math.round(tilesInRow / horizontalSectionSize) - 1)
                  .fill(null)
                  .map((_, index) => (
                    <SectionLine
                      key={`vertical-${index}`}
                      direction="vertical"
                      tileSize={tileSize}
                      tileGap={TILE_GAP}
                      index={(index + 1) * horizontalSectionSize}
                    />
                  ))}
              {verticalSectionSize > 0 &&
                new Array(Math.round(tileMap.length / verticalSectionSize) - 1)
                  .fill(null)
                  .map((_, index) => (
                    <SectionLine
                      key={`horizontal-${index}`}
                      direction="horizontal"
                      tileSize={tileSize}
                      tileGap={TILE_GAP}
                      index={(index + 1) * verticalSectionSize}
                    />
                  ))}
              <View style={{ gap: TILE_GAP }} pointerEvents="none">
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
                          getIsPuttingCrosses={getIsPuttingCrosses}
                          key={columnIndex}
                          size={tileSize}
                          tileGap={TILE_GAP}
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
              {isCompleted && (
                <View style={StyleSheet.absoluteFill}>
                  <ColoredMotive
                    nonogramKey={srcKey}
                    tileSize={tileSize}
                    tileGap={TILE_GAP}
                  />
                </View>
              )}
            </View>
            {isCompleted && (
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -32,
                }}
              >
                <CompletedName nonogramKey={srcKey} />
              </View>
            )}
          </View>
        </View>
      </View>
      <View
        style={{
          marginTop: 32,
          alignItems: "center",
        }}
      >
        <PutCrossesToggle
          value={isPuttingCrosses}
          onChange={setIsPuttingCrosses}
        />
      </View>
    </View>
  );
}
