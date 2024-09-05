import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

export const FILLED_COLOR = "#082f49";
const FILLED_COLOR_BORDER = "#041b29";
const EMPTY_COLOR = "white";
const CROSS_COLOR = "#0f172a";
const ERROR_BACKGROUND_COLOR = "#ef4444";

const COMPLETED_ANIMATION_DURATION = 400;
const COMPLETED_ANIMATION_DELAY = 100;

const FILLED_ANIMATION_DURATION = 250;
const CROSSED_ANIMATION_DURATION = 250;
const ERROR_ANIMATION_DURATION = 800;

export type TileProps = {
  getIsPuttingCrosses: () => boolean;
  size: number;
  tileGap: number;
  state: "empty" | "filled" | "crossed";
  rowIndex: number;
  columnIndex: number;
  isRowCompleted: boolean;
  isColumnCompleted: boolean;
};

export default memo(function Tile({
  getIsPuttingCrosses,
  size,
  tileGap,
  state,
  rowIndex,
  columnIndex,
  isRowCompleted,
  isColumnCompleted,
}: TileProps) {
  const fillAnimatedValue = useRef(
    new Animated.Value(state === "filled" ? 1 : 0),
  ).current;
  const errorBackgroundAnimatedValue = useRef(
    new Animated.Value(state === "crossed" ? 1 : 0),
  ).current;
  const crossScaleAnimatedValue = useRef(
    new Animated.Value(state === "crossed" ? 1 : 0),
  ).current;

  const completedAnimatedValue = useRef(new Animated.Value(0)).current;
  const [isAnimatingCompleted, setIsAnimatingCompleted] = useState(false);

  useEffect(() => {
    const isPuttingCrosses = getIsPuttingCrosses();
    const isFilledError = isPuttingCrosses && state === "filled";
    const isCrossedError = !isPuttingCrosses && state === "crossed";

    Animated.timing(fillAnimatedValue, {
      toValue: state === "filled" ? 1 : 0,
      duration: FILLED_ANIMATION_DURATION,
      delay: isFilledError ? ERROR_ANIMATION_DURATION : 0,
      useNativeDriver: true,
    }).start();

    Animated.timing(crossScaleAnimatedValue, {
      toValue: state === "crossed" ? 1 : 0,
      duration: CROSSED_ANIMATION_DURATION,
      delay: isCrossedError ? ERROR_ANIMATION_DURATION : 0,
      useNativeDriver: true,
    }).start();

    Animated.timing(errorBackgroundAnimatedValue, {
      toValue: isCrossedError || isFilledError ? 1 : 0,
      duration: ERROR_ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, [
    state,
    fillAnimatedValue,
    errorBackgroundAnimatedValue,
    crossScaleAnimatedValue,
    getIsPuttingCrosses,
  ]);

  useEffect(() => {
    Animated.timing(completedAnimatedValue, {
      toValue: isRowCompleted ? 1 : 0,
      duration: COMPLETED_ANIMATION_DURATION,
      delay: rowIndex * COMPLETED_ANIMATION_DELAY,
      useNativeDriver: true,
    }).start();
  }, [isRowCompleted, completedAnimatedValue, rowIndex]);

  const startCompletedAnimation = useCallback(
    (index: number) => {
      setIsAnimatingCompleted(true);
      completedAnimatedValue.setValue(0);
      Animated.parallel([
        Animated.timing(completedAnimatedValue, {
          toValue: 1,
          duration: COMPLETED_ANIMATION_DURATION,
          delay: index * COMPLETED_ANIMATION_DELAY,
          useNativeDriver: true,
        }),
        Animated.timing(crossScaleAnimatedValue, {
          toValue: 1,
          duration: COMPLETED_ANIMATION_DURATION,
          delay: index * COMPLETED_ANIMATION_DELAY,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimatingCompleted(false);
      });
    },
    [completedAnimatedValue, crossScaleAnimatedValue],
  );

  useEffect(() => {
    if (isColumnCompleted) {
      startCompletedAnimation(rowIndex);
    }
  }, [isColumnCompleted, rowIndex, startCompletedAnimation]);

  useEffect(() => {
    if (isRowCompleted) {
      startCompletedAnimation(columnIndex);
    }
  }, [isRowCompleted, columnIndex, startCompletedAnimation]);

  const isAutoCrossed =
    state === "empty" && (isRowCompleted || isColumnCompleted);

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        backgroundColor: EMPTY_COLOR,
        shadowRadius: 10,
        transform: [
          {
            scale: completedAnimatedValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [1, 0.9, 1],
            }),
          },
          {
            rotate: completedAnimatedValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: ["0deg", "15deg", "0deg"],
            }),
          },
        ],
      }}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            width: size,
            height: size,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: errorBackgroundAnimatedValue.interpolate({
              inputRange: [0, 0.4, 0.8, 1],
              outputRange: [
                `${ERROR_BACKGROUND_COLOR}00`,
                ERROR_BACKGROUND_COLOR,
                ERROR_BACKGROUND_COLOR,
                `${ERROR_BACKGROUND_COLOR}00`,
              ],
            }),
            transform: isAutoCrossed
              ? []
              : [
                  {
                    scale: errorBackgroundAnimatedValue.interpolate({
                      inputRange: [0, 0.3, 1],
                      outputRange: [0, 1, 1],
                    }),
                  },
                ],
          },
        ]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Animated.Image
          source={require("@assets/images/icons/xmark.png")}
          style={{
            width: size * 0.35,
            height: size * 0.35,
            tintColor: CROSS_COLOR,
            transform: [
              {
                scale: crossScaleAnimatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ],
          }}
        />
      </View>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            width: size,
            height: size,
            zIndex: isAnimatingCompleted ? 10 : 0,
            borderWidth: 1,
            borderColor: FILLED_COLOR_BORDER,
            backgroundColor: FILLED_COLOR,
            transform: [
              {
                scale: fillAnimatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, (size + tileGap) / size],
                }),
              },
            ],
          },
        ]}
      />
    </Animated.View>
  );
});
