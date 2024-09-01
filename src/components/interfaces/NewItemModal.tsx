import {
  Animated,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  useAnimatedValue,
} from "react-native";
import HighlightedImage from "../HighlightedImage";
import { useEffect } from "react";

type Props = {
  visible: boolean;
  onClose: () => void;
  imageSource: ImageSourcePropType;
  imageHeight: number;
  imageWidth: number;
};

export default function NewItemModal({
  visible,
  onClose,
  imageSource,
  imageHeight,
  imageWidth,
}: Props) {
  const animatedValue = useAnimatedValue(visible ? 1 : 0);

  useEffect(() => {
    animatedValue.stopAnimation();

    Animated.timing(animatedValue, {
      toValue: visible ? 1 : 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [visible, animatedValue]);

  const close = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Modal visible={visible} onRequestClose={close} transparent>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#0005",
            opacity: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        ]}
      >
        <HighlightedImage
          source={imageSource}
          height={imageHeight}
          width={imageWidth}
          onPress={close}
        />
      </Animated.View>
    </Modal>
  );
}
