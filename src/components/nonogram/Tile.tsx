import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";

const FILLED_COLOR = "#082f49";
const FILLED_COLOR_BORDER = "#041b29";
const EMPTY_COLOR = "white";
const CROSS_COLOR = "#0f172a";
const CROSS_BACKGROUND_COLOR = "#ef4444";

const COMPLETED_ANIMATION_DURATION = 400;
const COMPLETED_ANIMATION_DELAY = 100;

export type TileProps = {
  size: number;
  state: "empty" | "filled" | "crossed";
  rowIndex: number;
  columnIndex: number;
  isRowCompleted: boolean;
  isColumnCompleted: boolean;
};

export default memo(function Tile({
  size,
  state,
  rowIndex,
  columnIndex,
  isRowCompleted,
  isColumnCompleted,
}: TileProps) {
  const fillAnimatedValue = useRef(
    new Animated.Value(state === "filled" ? 1 : 0),
  ).current;
  const crossBackgroundAnimatedValue = useRef(
    new Animated.Value(state === "crossed" ? 1 : 0),
  ).current;
  const crossScaleAnimatedValue = useRef(
    new Animated.Value(state === "crossed" ? 1 : 0),
  ).current;

  const completedAnimatedValue = useRef(new Animated.Value(0)).current;
  const [isAnimatingCompleted, setIsAnimatingCompleted] = useState(false);

  useEffect(() => {
    Animated.timing(fillAnimatedValue, {
      toValue: state === "filled" ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();

    Animated.timing(crossBackgroundAnimatedValue, {
      toValue: state === "crossed" ? 1 : 0,
      duration: 750,
      useNativeDriver: true,
    }).start();

    Animated.timing(crossScaleAnimatedValue, {
      toValue: state === "crossed" ? 1 : 0,
      duration: 750,
      useNativeDriver: true,
    }).start();
  }, [
    state,
    fillAnimatedValue,
    crossBackgroundAnimatedValue,
    crossScaleAnimatedValue,
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
            backgroundColor: crossBackgroundAnimatedValue.interpolate({
              inputRange: [0, 0.3, 0.7, 1],
              outputRange: [
                `${CROSS_BACKGROUND_COLOR}00`,
                CROSS_BACKGROUND_COLOR,
                CROSS_BACKGROUND_COLOR,
                `${CROSS_BACKGROUND_COLOR}00`,
              ],
            }),
            transform: isAutoCrossed
              ? []
              : [
                  {
                    scale: crossScaleAnimatedValue.interpolate({
                      inputRange: [0, 0.3, 1],
                      outputRange: [0, 1, 1],
                    }),
                  },
                ],
          },
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
                  inputRange: [0, 0.75, 1],
                  outputRange: [0, 0, 1],
                }),
              },
            ],
          }}
        />
      </Animated.View>
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
                  outputRange: [0, 1.1],
                }),
              },
            ],
          },
        ]}
      />
    </Animated.View>
  );
});
