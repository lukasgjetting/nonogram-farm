import { useRef } from "react";
import { PanResponder } from "react-native";

const useNonogramPanResponder = (opts: {
  tileSize: number;
  tileGap: number;
  onRevealTile: (rowIndex: number, columnIndex: number) => boolean;
}) => {
  const isPanCancelledRef = useRef(false);
  const latestRevealedTileRef = useRef<{
    rowIndex: number;
    columnIndex: number;
  } | null>(null);

  const handleTouch = (x: number, y: number) => {
    if (isPanCancelledRef.current) {
      return;
    }

    const rowIndex = Math.floor(y / (opts.tileSize + opts.tileGap));
    const columnIndex = Math.floor(x / (opts.tileSize + opts.tileGap));

    if (
      latestRevealedTileRef.current?.columnIndex !== columnIndex ||
      latestRevealedTileRef.current?.rowIndex !== rowIndex
    ) {
      latestRevealedTileRef.current = { rowIndex, columnIndex };
      const isCorrect = opts.onRevealTile(rowIndex, columnIndex);

      // If player made a mistake, cancel the pan responder
      if (!isCorrect) {
        isPanCancelledRef.current = true;
      }
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => {
        isPanCancelledRef.current = false;
        handleTouch(e.nativeEvent.locationX, e.nativeEvent.locationY);
        return true;
      },
      onStartShouldSetPanResponderCapture: (e, gestureState) => {
        isPanCancelledRef.current = false;
        handleTouch(e.nativeEvent.locationX, e.nativeEvent.locationY);
        return true;
      },
      onMoveShouldSetPanResponder: (e, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (e, gestureState) => true,
      onPanResponderMove: (e, gestureState) => {
        handleTouch(e.nativeEvent.locationX, e.nativeEvent.locationY);
      },
      onPanResponderRelease: (e, gestureState) => {
        isPanCancelledRef.current = false;
      },
    }),
  ).current;

  return panResponder;
};

export default useNonogramPanResponder;
