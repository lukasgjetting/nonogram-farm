import { View } from "react-native";
import PutCrossesToggle from "./PutCrossesToggle";
import ZoomToggle from "./ZoomToggle";

type ControlsProps = {
  isPuttingCrosses: boolean;
  onIsPuttingCrossesChange: (value: boolean) => void;
  isZoomed: boolean;
  onIsZoomedChange: (value: boolean) => void;
};

export default function Controls({
  isPuttingCrosses,
  onIsPuttingCrossesChange,
  isZoomed,
  onIsZoomedChange,
}: ControlsProps) {
  return (
    <View
      style={{
        alignItems: "center",
      }}
    >
      <PutCrossesToggle
        value={isPuttingCrosses}
        onChange={onIsPuttingCrossesChange}
      />
      <ZoomToggle value={isZoomed} onChange={onIsZoomedChange} />
    </View>
  );
}
