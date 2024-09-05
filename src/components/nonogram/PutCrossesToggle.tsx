import { useEffect } from "react";
import {
  Animated,
  Image,
  TouchableWithoutFeedback,
  useAnimatedValue,
  View,
} from "react-native";
import { FILLED_COLOR } from "./Tile";
import { AXIS_LINE_BACKGROUND_COLOR } from "./AxisLine";

const CIRCLE_SIZE = 56;
const CIRCLE_PADDING = 4;
const CIRCLE_GAP = 8;
const CIRCLE_COLOR = "#FFF";

const FILLED_BOX_SIZE = CIRCLE_SIZE * 0.4;
const CROSS_SIZE = CIRCLE_SIZE * 0.35;

const ACTIVE_COLOR = FILLED_COLOR;
const INACTIVE_COLOR = `${FILLED_COLOR}BB`;

type PutCrossesToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function PutCrossesToggle({
  value,
  onChange,
}: PutCrossesToggleProps) {
  const animatedValue = useAnimatedValue(value ? 1 : 0);

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: value ? 1 : 0,
      overshootClamping: true,
      useNativeDriver: true,
    }).start();
  }, [value, animatedValue]);

  return (
    <TouchableWithoutFeedback onPress={() => onChange(!value)}>
      <View
        style={{
          backgroundColor: AXIS_LINE_BACKGROUND_COLOR,
          padding: CIRCLE_PADDING,
          borderRadius: CIRCLE_SIZE + CIRCLE_PADDING,
          width: 2 * (CIRCLE_SIZE + CIRCLE_PADDING) + CIRCLE_GAP,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Animated.View
          style={{
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: CIRCLE_SIZE / 2,
            backgroundColor: CIRCLE_COLOR,
            justifyContent: "center",
            alignItems: "center",
            transform: [
              {
                translateX: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, CIRCLE_SIZE + CIRCLE_GAP],
                }),
              },
              {
                rotate: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "90deg"],
                }),
              },
            ],
          }}
        >
          <Animated.View
            style={{
              position: "absolute",
              width: FILLED_BOX_SIZE,
              height: FILLED_BOX_SIZE,
              borderRadius: 2,
              backgroundColor: ACTIVE_COLOR,
              opacity: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            }}
          />
          <Animated.Image
            source={require("@assets/images/icons/xmark.png")}
            style={{
              position: "absolute",
              width: CROSS_SIZE,
              height: CROSS_SIZE,
              tintColor: ACTIVE_COLOR,
              opacity: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            }}
          />
        </Animated.View>
        <View
          style={{
            left: CIRCLE_PADDING + (CIRCLE_SIZE - FILLED_BOX_SIZE) / 2,
            top: CIRCLE_PADDING + (CIRCLE_SIZE - FILLED_BOX_SIZE) / 2,
            position: "absolute",
            zIndex: -1,
            width: FILLED_BOX_SIZE,
            height: FILLED_BOX_SIZE,
            borderRadius: 2,
            backgroundColor: INACTIVE_COLOR,
          }}
        />
        <Image
          source={require("@assets/images/icons/xmark.png")}
          style={{
            right: CIRCLE_PADDING + (CIRCLE_SIZE - CROSS_SIZE) / 2,
            top: CIRCLE_PADDING + (CIRCLE_SIZE - CROSS_SIZE) / 2,
            position: "absolute",
            zIndex: -1,
            width: CROSS_SIZE,
            height: CROSS_SIZE,
            borderRadius: 2,
            tintColor: INACTIVE_COLOR,
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
