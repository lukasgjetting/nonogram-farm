import { windowSize } from "@/constants/windowSize";
import { ReactNode } from "react";
import { Modal as NativeModal, StyleSheet, View } from "react-native";

type GameModalProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function GameModal({
  visible,
  onClose,
  children,
}: GameModalProps) {
  return (
    <NativeModal transparent visible={visible} onRequestClose={onClose}>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: "#0003",
          },
        ]}
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "white",
            width: windowSize.width - 80,
            padding: 12,
            borderRadius: 10,
          }}
        >
          {children}
        </View>
      </View>
    </NativeModal>
  );
}
