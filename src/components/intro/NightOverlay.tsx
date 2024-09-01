import { StyleSheet, View } from "react-native";

export default function NightOverlay() {
  return (
    <>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "#d03e10",
            opacity: 0.5,
          },
        ]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "#091451",
            opacity: 0.5,
          },
        ]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "#000",
            opacity: 0.2,
          },
        ]}
      />
    </>
  );
}
