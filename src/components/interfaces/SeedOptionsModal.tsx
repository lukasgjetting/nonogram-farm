import { SEED_BAG_IMAGES, SeedType } from "@/src/constants/seeds";
import { useSaveData } from "@/src/lib/save-data";
import { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from "react-native";

type SeedOptionsModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (seed: SeedType) => void;
};

export default function SeedOptionsModal({
  visible,
  onClose,
  onSelect,
}: SeedOptionsModalProps) {
  const [isClosing, setIsClosing] = useState(visible ? false : true);
  const animatedValue = useAnimatedValue(visible ? 1 : 0);

  useEffect(() => {
    setIsClosing(!visible);
  }, [visible]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isClosing ? 0 : 1,
      easing: Easing.linear,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      if (isClosing) {
        onClose();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClosing, animatedValue]);

  const [{ seeds }] = useSaveData();

  const availableSeeds = Object.entries(seeds)
    .filter(([_seed, count]) => count != null && count > 0)
    .map(([seed]) => seed as SeedType);

  if (availableSeeds.length === 0) {
    return null;
  }

  const close = () => {
    setIsClosing(true);
  };

  return (
    <Modal transparent visible={visible} onRequestClose={close}>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 30,
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={close}>
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ["#0000", "#0008"],
              }),
            }}
          />
        </Pressable>
        {availableSeeds.map((s, index) => {
          const inputStart = index * (1 / availableSeeds.length);
          const inputEnd = (index + 1) * (1 / availableSeeds.length);
          const endOpacity = (seeds[s] ?? 0) > 0 ? 1 : 0.8;
          return (
            <TouchableOpacity
              key={s}
              activeOpacity={0.8}
              onPress={() => {
                onSelect(s);
                close();
              }}
            >
              <Animated.View
                style={{
                  opacity: animatedValue.interpolate({
                    inputRange: [0, inputStart, inputEnd, 1],
                    outputRange: [0, 0, endOpacity, endOpacity],
                  }),
                  transform: [
                    {
                      translateY: animatedValue.interpolate({
                        inputRange: [0, inputStart, inputEnd, 1],
                        outputRange: [30, 30, 0, 0],
                      }),
                    },
                  ],
                }}
              >
                <Image
                  source={SEED_BAG_IMAGES[s]}
                  style={{ width: 60, height: 100, resizeMode: "contain" }}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Modal>
  );
}
