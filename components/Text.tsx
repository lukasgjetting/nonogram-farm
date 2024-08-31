import { Text as NativeText, Platform, TextProps } from "react-native";

export default function Text({ style, ...props }: TextProps) {
  return (
    <NativeText
      style={[
        {
          fontFamily: Platform.select({
            android: "Grandstander_400Regular",
            ios: "Grandstander-Regular",
          }),
        },
        style,
      ]}
      {...props}
    />
  );
}
