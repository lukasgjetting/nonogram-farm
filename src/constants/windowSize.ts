import { Dimensions } from "react-native";

export const windowSize = Dimensions.get("window");

export const dx = (x: number) => (x / 100) * windowSize.width;
export const dy = (y: number) => (y / 100) * windowSize.height;
