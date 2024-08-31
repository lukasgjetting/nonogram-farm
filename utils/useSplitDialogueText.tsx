import Text from "@/components/Text";
import { useRef, useState } from "react";
import { SectionListComponent, StyleSheet, TextStyle } from "react-native";

const ellipsisText = "(...)";

const useSplitDialogueText = (
  text: string,
  textStyle: TextStyle,
  maxLines: number,
) => {
  const [isReady, setIsReady] = useState(false);
  const [sections, setSections] = useState<string[]>([]);
  const [newText, setNewText] = useState(text);

  const valuesRef = useRef<{
    ellipsisWidth?: number;
    containerWidth?: number;
    originalLines?: {
      text: string;
      width: number;
    }[];
  }>({});

  const calculateNewLines = () => {
    const { ellipsisWidth, containerWidth, originalLines } = valuesRef.current;

    if (!ellipsisWidth || !containerWidth || !originalLines) {
      return;
    }

    const sections: string[] = [];

    let currentSectionLines: string[] = [];

    const linesToUse = [...originalLines];

    const commitSection = () => {
      sections.push(currentSectionLines.join(""));
      currentSectionLines = [];
    };

    for (let i = 0; i < linesToUse.length; i++) {
      const line = linesToUse[i]!;

      currentSectionLines.push(line.text);

      // If not at max lines, just continue
      if (currentSectionLines.length < maxLines) {
        continue;
      }

      // If this was the last line, commit section -> done
      if (i === linesToUse.length - 1) {
        commitSection();
        break;
      }

      // We need to add an ellipsis

      console.log("last line width", {
        lineWidth: line.width,
        ellipsisWidth,
        containerWidth,
        fits: line.width + ellipsisWidth <= containerWidth,
      });

      // If it can fit, easy! Just append, commit section and continue
      if (line.width + ellipsisWidth <= containerWidth) {
        currentSectionLines[currentSectionLines.length - 1] += ellipsisText;
        commitSection();
        continue;
      }

      // Otherwise we need to move a word to next line and re-run measurement
      const lineWords = line.text.trimEnd().split(" ");
      // Pop two to include the trailing space
      const lastWord = lineWords.pop();

      console.log("newlastline", `${lineWords.join(" ")} ${ellipsisText}`);
      currentSectionLines.push(`${lineWords.join(" ")} ${ellipsisText}`);
      commitSection();

      // Move word to next work
      linesToUse[i + 1]!.text = `${lastWord} ${linesToUse[i + 1]!.text}`;

      if (i + 1 === linesToUse.length - 1) {
        currentSectionLines.push(...linesToUse.slice(i + 1).map((l) => l.text));
        commitSection();
      }
    }

    console.log({ originalLines: originalLines.map((l) => l.text), sections });
    setSections(sections);
    setNewText(sections.join("\n"));
    setIsReady(true);
  };

  const measurementNodes = (
    <>
      <Text
        style={textStyle}
        onTextLayout={(e) => {
          valuesRef.current.ellipsisWidth = e.nativeEvent.lines[0]?.width ?? 50;
          calculateNewLines();
        }}
      >
        (...)
      </Text>
      <Text
        style={[StyleSheet.absoluteFill, textStyle]}
        onLayout={(e) => {
          valuesRef.current.containerWidth = e.nativeEvent.layout.width;
          calculateNewLines();
        }}
        onTextLayout={(e) => {
          valuesRef.current.originalLines = e.nativeEvent.lines.map((l) => ({
            text: l.text,
            width: l.width,
          }));

          calculateNewLines();
        }}
      >
        {text}
      </Text>
    </>
  );

  return {
    measurementNodes,
    isReady,
    sections,
  };
};

export default useSplitDialogueText;
