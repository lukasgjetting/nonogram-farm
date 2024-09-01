import { windowSize } from "@/src/constants/windowSize";
import {
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  View,
} from "react-native";

export const ITEM_SIZE = windowSize.width / 3 - 48;
const ITEMS_PER_ROW = 3;
const NUMBER_OF_ROWS = 3;

type Item<TExtra> = {
  id: string;
  image: ImageSourcePropType;
  extra: TExtra;
};

type Props<TExtra> = {
  items: Item<TExtra>[];
  onPress: (item: Item<TExtra>) => void;
  renderExtra: (item: Item<TExtra>) => React.ReactNode;
};

export default function ItemSlots<TExtra>({
  items,
  onPress,
  renderExtra,
}: Props<TExtra>) {
  return (
    <View>
      {new Array(NUMBER_OF_ROWS).fill(null).map((_, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 24,
            flexDirection: "row",
            justifyContent: "space-around",
            alignSelf: "stretch",
          }}
        >
          {new Array(ITEMS_PER_ROW).fill(null).map((_, index) => {
            const item = items[index + rowIndex * ITEMS_PER_ROW];
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                disabled={item == null}
                onPress={() => {
                  if (item == null) {
                    return;
                  }

                  onPress(item);
                }}
                style={{
                  width: ITEM_SIZE,
                  height: ITEM_SIZE,
                  borderRadius: 16,
                  backgroundColor: "#ffffff19",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item != null && (
                  <Image
                    source={item.image}
                    style={{
                      width: "80%",
                      height: "80%",
                      borderRadius: 16,
                      resizeMode: "contain",
                    }}
                  />
                )}
                {item != null && renderExtra(item)}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}
