import Text from "@/src/components/Text";
import { useRef, useState } from "react";
import { StyleSheet, TextStyle } from "react-native";

const ellipsisText = "→";

const useSplitDialogueText = (
  text: string,
  textStyle: TextStyle,
  maxLines: number,
) => {
  const [sections, setSections] = useState<string[]>();
  const [textToMeasure, setTextToMeasure] = useState(text);

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

    const linesToUse = originalLines.map((l) => ({ ...l }));

    const commitSection = () => {
      sections.push(currentSectionLines.join(""));
      currentSectionLines = [];
    };

    for (let i = 0; i < linesToUse.length; i++) {
      const line = linesToUse[i]!;

      currentSectionLines.push(line.text);

      // If this was the last line, commit section -> done (by setting sections state)
      if (i === linesToUse.length - 1) {
        commitSection();
        setSections(sections);
        return;
      }

      // If not at max lines, just continue
      if (currentSectionLines.length < maxLines) {
        continue;
      }

      // OK - if we reach this, we need to add an ellipsis since we are
      // at max lines of this section and there are more lines to show

      // If the line already ends with ellipsis, commit section and continue
      if (
        line.text.endsWith(ellipsisText) ||
        line.text.endsWith(`${ellipsisText} `)
      ) {
        commitSection();
        continue;
      }

      // If it can fit, easy! Just append, commit section and continue
      if (line.width + ellipsisWidth <= containerWidth) {
        commitSection();
        continue;
      }

      // Since it doesn't fit we need to move a word to next line and re-run measurement
      const lineWords = line.text.trimEnd().split(" ");
      const lastWord = lineWords.pop();

      currentSectionLines[currentSectionLines.length - 1]! =
        currentSectionLines[currentSectionLines.length - 1]!.replace(
          new RegExp(`${lastWord?.replaceAll("?", "\\?")} ?$`),
          ellipsisText,
        );
      commitSection();

      // Move word to next work
      linesToUse[i + 1]!.text = `${lastWord} ${linesToUse[i + 1]!.text}`;

      // Commit the remaining lines to a new section
      currentSectionLines.push(...linesToUse.slice(i + 1).map((l) => l.text));
      commitSection();

      // Reset lines and re-run measurement
      valuesRef.current.originalLines = undefined;
      setTextToMeasure(sections.map((s) => s.trim()).join(" "));
      break;
    }
  };

  const measurementNodes = (
    <>
      <Text
        style={[textStyle, { opacity: 0 }]}
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
        {textToMeasure}
      </Text>
    </>
  );

  return {
    measurementNodes,
    isReady: sections != null,
    sections: sections ?? [],
  };
};

export default useSplitDialogueText;
