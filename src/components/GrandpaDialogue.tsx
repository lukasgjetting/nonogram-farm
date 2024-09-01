import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import Text from "./Text";
import { windowSize } from "@/src/constants/windowSize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import useSplitDialogueText from "@/src/utils/useSplitDialogueText";

const GRANDPA_ASPECT_RATIO = 0.725;
const GRANDPA_WIDTH = windowSize.width * 0.25;
const GRANDPA_HEIGHT = GRANDPA_WIDTH / GRANDPA_ASPECT_RATIO;

const CHARACTER_DELAY_MS = 20;
const TEXT_LINE_HEIGHT = 24;
const TEXT_MAX_NUMBER_OF_LINES = 6;

const TEXT_BOX_HEIGHT = TEXT_LINE_HEIGHT * TEXT_MAX_NUMBER_OF_LINES;
const TEXT_BOX_PADDING = 16;
const MARGIN_VERTICAL = 48;

const TEXT_STYLE: TextStyle = {
  fontSize: 20,
  lineHeight: TEXT_LINE_HEIGHT,
  flexShrink: 1,
};

type Props = {
  text: string;
  onComplete: () => void;
  delay?: number;
};

export default function GrandpaDialogue({
  text: rawText,
  onComplete,
  delay = 0,
}: Props) {
  const insets = useSafeAreaInsets();

  const animatedValue = useRef(new Animated.Value(0)).current;

  const [isFinished, setIsFinished] = useState(false);
  const [didCompleteFinishAnimation, setDidCompleteFinishAnimation] =
    useState(false);
  const [lastShownIndex, setLastShownIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    Animated.spring(animatedValue, {
      delay: isFinished ? 0 : delay,
      toValue: isFinished ? 0 : 1,
      useNativeDriver: true,
      bounciness: isFinished ? 0 : 6,
    }).start(() => {
      if (isFinished) {
        setDidCompleteFinishAnimation(true);
        onComplete();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished, animatedValue]);

  const { measurementNodes, sections, isReady } = useSplitDialogueText(
    rawText,
    TEXT_STYLE,
    TEXT_MAX_NUMBER_OF_LINES,
  );

  const currentSection = sections[currentSectionIndex] ?? "";

  const onPress = () => {
    if (lastShownIndex < currentSection.length) {
      setLastShownIndex(currentSection.length);
      return;
    }

    if (currentSectionIndex < sections.length - 1) {
      setLastShownIndex(0);
      setCurrentSectionIndex((prev) => prev + 1);
      return;
    }

    setIsFinished(true);
  };

  useEffect(() => {
    if (!isReady) {
      return;
    }

    setLastShownIndex(0);

    let intervalId: NodeJS.Timeout | null = null;

    // Delay starting until modal is shown, but only first section
    setTimeout(
      () => {
        intervalId = setInterval(() => {
          setLastShownIndex((index) => {
            if (index >= currentSection.length && intervalId != null) {
              clearInterval(intervalId);
            }

            return index + 1;
          });
        }, CHARACTER_DELAY_MS);
      },
      currentSectionIndex === 0 ? delay + 200 : 0,
    );

    return () => {
      if (intervalId != null) {
        clearInterval(intervalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, currentSectionIndex, currentSection.length]);

  const totalOffset =
    TEXT_BOX_HEIGHT +
    2 * TEXT_BOX_PADDING +
    2 * MARGIN_VERTICAL +
    insets.bottom;

  return (
    <Modal transparent visible={!didCompleteFinishAnimation}>
      <Animated.View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [totalOffset, 0],
              }),
            },
          ],
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            paddingHorizontal: 16,
            paddingTop: MARGIN_VERTICAL,
            paddingBottom: insets.bottom + MARGIN_VERTICAL,
            gap: 24,
          }}
        >
          <LinearGradient
            colors={["#0000", "#0005"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Image
            source={require("@assets/images/grandpa.png")}
            style={{ width: GRANDPA_WIDTH, height: GRANDPA_HEIGHT }}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              elevation: 1,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              borderRadius: 16,
              padding: TEXT_BOX_PADDING,
            }}
          >
            <View
              style={{
                height: TEXT_BOX_HEIGHT,
                overflow: "hidden",
              }}
            >
              {isReady ? (
                <Text style={TEXT_STYLE}>
                  {currentSection.slice(0, lastShownIndex)}
                  <Text style={{ color: "white" }}>
                    {currentSection.slice(lastShownIndex)}
                  </Text>
                </Text>
              ) : (
                <View style={{ height: 1000 }}>{measurementNodes}</View>
              )}
            </View>
          </View>
        </View>
      </Animated.View>
      <TouchableOpacity style={[StyleSheet.absoluteFill]} onPress={onPress} />
    </Modal>
  );
}
