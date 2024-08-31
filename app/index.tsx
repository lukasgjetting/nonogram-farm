import { ImageBackground, StatusBar, View } from "react-native";
import { Link } from "expo-router";
import getNonogramHref from "@/utils/getNonogramHref";
import Text from "@/components/Text";
import ScrollingBackgroundImage from "@/components/ScrollingBackgroundImage";
import { windowSize } from "@/constants/windowSize";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={"dark-content"} />
      <ImageBackground
        style={{ flex: 1, justifyContent: "center", backgroundColor: "red" }}
        imageStyle={{ resizeMode: "cover" }}
        source={require("@assets/images/farm.png")}
      >
        <View style={{ flex: 1 }}>
          <ScrollingBackgroundImage
            source={require("@/assets/images/clouds-small.png")}
            aspectRatio={6.4}
            speed={0.3}
            height={windowSize.height * 0.1}
          />
          <Link href={getNonogramHref("intro.house")}>
            <Text>Intro House</Text>
          </Link>
        </View>
      </ImageBackground>
    </View>
  );
}
