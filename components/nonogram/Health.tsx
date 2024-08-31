import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

export type HealthProps = {
  currentHealth: number;
  maxHealth: number;
};

const HEART_SIZE = 32;
const HEART_ON_COLOR = "#ef4444";
const HEART_OFF_COLOR = "#CCC";

const HEART_ANIMATION_DURATION = 200;
const MULTIPLE_HEARTS_ANIMATION_DELAY = 100;

export default function Health({ currentHealth, maxHealth }: HealthProps) {
  const latestHealthRef = useRef(currentHealth);
  const heartAnimatedValuesRefs = useRef(
    Array(maxHealth)
      .fill(null)
      .map((_, index) => new Animated.Value(index < currentHealth ? 1 : 0)),
  ).current;

  if (maxHealth !== heartAnimatedValuesRefs.length) {
    throw new Error("Changing maxHealth dynamically is not supported");
  }

  useEffect(() => {
    if (latestHealthRef.current === currentHealth) {
      return;
    }

    const lostHealth = latestHealthRef.current - currentHealth;

    latestHealthRef.current = currentHealth;

    if (lostHealth < 0) {
      console.log({ lostHealth, currentHealth });
      heartAnimatedValuesRefs.forEach((value, index) => {
        if (index <= currentHealth - 1) {
          value.setValue(1);
        }
      });
      return;
    }

    Animated.parallel(
      Array(lostHealth)
        .fill(null)
        .map((_, index) =>
          Animated.sequence([
            ...(index > 0
              ? [Animated.delay(MULTIPLE_HEARTS_ANIMATION_DELAY * index)]
              : []),
            Animated.timing(heartAnimatedValuesRefs[currentHealth + index]!, {
              toValue: 0,
              duration: HEART_ANIMATION_DURATION,
              useNativeDriver: true,
            }),
          ]),
        ),
    ).start();
  }, [heartAnimatedValuesRefs, maxHealth, currentHealth]);

  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      {new Array(maxHealth).fill(null).map((_, index) => (
        <View key={index}>
          <Image
            source={require("../../assets/images/icons/heart.png")}
            style={{
              width: HEART_SIZE,
              height: HEART_SIZE,
              resizeMode: "contain",
              tintColor: HEART_OFF_COLOR,
            }}
          />
          <Animated.Image
            source={require("../../assets/images/icons/heart.png")}
            style={[
              StyleSheet.absoluteFillObject,
              {
                width: HEART_SIZE,
                height: HEART_SIZE,
                resizeMode: "contain",
                tintColor: HEART_ON_COLOR,
                opacity: heartAnimatedValuesRefs[index]!.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
}
