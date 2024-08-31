import {
  Image,
  Modal,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import Text from "./Text";
import { windowSize } from "@/constants/windowSize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import useSplitDialogueText from "@/utils/useSplitDialogueText";

const GRANDPA_ASPECT_RATIO = 0.725;
const GRANDPA_WIDTH = windowSize.width * 0.25;
const GRANDPA_HEIGHT = GRANDPA_WIDTH / GRANDPA_ASPECT_RATIO;

const TEXT_LINE_HEIGHT = 24;
const TEXT_MAX_NUMBER_OF_LINES = 6;

const TEXT_STYLE: TextStyle = {
  fontSize: 20,
  lineHeight: TEXT_LINE_HEIGHT,
  flexShrink: 1,
};

type Props = {
  text: string;
};

export default function GrandpaDialogue({ text: rawText }: Props) {
  const insets = useSafeAreaInsets();

  const [lastShownIndex, setLastShownIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const { measurementNodes, sections, isReady } = useSplitDialogueText(
    rawText,
    TEXT_STYLE,
    TEXT_MAX_NUMBER_OF_LINES,
  );

  const currentSection = sections[currentSectionIndex] ?? "";

  useEffect(() => {
    if (!isReady) {
      return;
    }

    setLastShownIndex(0);
    const intervalId = setInterval(() => {
      setLastShownIndex((index) => {
        if (index >= currentSection.length) {
          clearInterval(intervalId);
        }

        return index + 1;
      });
    }, 50);

    return () => clearInterval(intervalId);
  }, [isReady, currentSection.length]);

  return (
    <Modal transparent visible>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          marginBottom: insets.bottom,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            paddingHorizontal: 16,
            paddingBottom: 48,
            gap: 24,
          }}
        >
          <Image
            source={require("@assets/images/grandpa.png")}
            style={{ width: GRANDPA_WIDTH, height: GRANDPA_HEIGHT }}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <View
              style={{
                height: TEXT_LINE_HEIGHT * TEXT_MAX_NUMBER_OF_LINES,
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
      </View>
      <TouchableOpacity
        style={[StyleSheet.absoluteFill]}
        onPress={() => {
          setCurrentSectionIndex((index) => {
            if (index >= sections.length - 1) {
              return 0;
            }

            return index + 1;
          });
        }}
      />
    </Modal>
  );
}
