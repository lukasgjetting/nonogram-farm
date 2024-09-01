import { Text as NativeText, Platform, TextProps } from "react-native";

const fonts = {
  regular: Platform.select({
    android: "Grandstander_400Regular",
    ios: "Grandstander-Regular",
  }),
  semibold: Platform.select({
    android: "Grandstander_600SemiBold",
    ios: "Grandstander-SemiBold",
  }),
} as const;

type FontOption = keyof typeof fonts;

type Props = TextProps & {
  font?: FontOption;
};

export default function Text({ style, font = "regular", ...props }: Props) {
  return (
    <NativeText
      style={[
        {
          fontFamily: fonts[font],
        },
        style,
      ]}
      {...props}
    />
  );
}
