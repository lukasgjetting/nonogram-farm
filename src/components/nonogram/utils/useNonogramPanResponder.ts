import { windowSize } from "@/src/constants/windowSize";
import { useEffect, useRef } from "react";
import { Animated, PanResponder, useAnimatedValue } from "react-native";
import { MAX_ZOOM } from "./useZoom";

const MAX_PAN = ((MAX_ZOOM - 1) * windowSize.width) / 2;

const getPanValue = (value: number) => {
  if (value > MAX_PAN) {
    return MAX_PAN;
  }

  if (value < -MAX_PAN) {
    return -MAX_PAN;
  }

  return value;
};

const PAN_SCALE = 0.5;

const useNonogramPanResponder = (opts: {
  tileSize: number;
  tileGap: number;
  onRevealTile: (rowIndex: number, columnIndex: number) => boolean;
  isZoomed: boolean;
}) => {
  const panXAnimatedValue = useAnimatedValue(0);
  const panYAnimatedValue = useAnimatedValue(0);

  const panXRef = useRef(0);
  const panYRef = useRef(0);

  const isPanCancelledRef = useRef(false);
  const latestRevealedTileRef = useRef<{
    rowIndex: number;
    columnIndex: number;
  } | null>(null);

  const isPanningZoomRef = useRef(false);
  const isZoomedRef = useRef(opts.isZoomed);
  isZoomedRef.current = opts.isZoomed;

  const onRevealRef = useRef(opts.onRevealTile);
  onRevealRef.current = opts.onRevealTile;

  useEffect(() => {
    if (!opts.isZoomed) {
      Animated.spring(panXAnimatedValue, {
        toValue: 0,
        useNativeDriver: true,
        overshootClamping: true,
      }).start();

      Animated.spring(panYAnimatedValue, {
        toValue: 0,
        useNativeDriver: true,
        overshootClamping: true,
      }).start();

      panXRef.current = 0;
      panYRef.current = 0;
    }
  }, [opts.isZoomed, panXAnimatedValue, panYAnimatedValue]);

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
      const isCorrect = onRevealRef.current(rowIndex, columnIndex);

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

        if (!isZoomedRef.current) {
          handleTouch(e.nativeEvent.locationX, e.nativeEvent.locationY);
        }

        return true;
      },
      onStartShouldSetPanResponderCapture: (e, gestureState) => {
        isPanCancelledRef.current = false;

        if (!isZoomedRef.current) {
          handleTouch(e.nativeEvent.locationX, e.nativeEvent.locationY);
        }

        return true;
      },
      onMoveShouldSetPanResponder: (e, gestureState) => {
        return true;
      },
      onMoveShouldSetPanResponderCapture: (e, gestureState) => true,
      onPanResponderMove: (e, gestureState) => {
        if (
          isZoomedRef.current &&
          (Math.abs(gestureState.dx) >= 5 || Math.abs(gestureState.dy) >= 5)
        ) {
          isPanningZoomRef.current = true;
        }

        if (isZoomedRef.current && isPanningZoomRef.current) {
          panXAnimatedValue.setValue(
            getPanValue(panXRef.current + gestureState.dx) * PAN_SCALE,
          );
          panYAnimatedValue.setValue(
            getPanValue(panYRef.current + gestureState.dy) * PAN_SCALE,
          );
        } else if (!isZoomedRef.current) {
          handleTouch(e.nativeEvent.locationX, e.nativeEvent.locationY);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (isZoomedRef.current) {
          panXRef.current = getPanValue(gestureState.dx + panXRef.current);
          panYRef.current = getPanValue(gestureState.dy + panYRef.current);

          if (!isPanningZoomRef.current) {
            handleTouch(e.nativeEvent.locationX, e.nativeEvent.locationY);
          }
        }

        isPanCancelledRef.current = false;
        isPanningZoomRef.current = false;
      },
    }),
  ).current;

  return { panResponder, panXAnimatedValue, panYAnimatedValue };
};

export default useNonogramPanResponder;
