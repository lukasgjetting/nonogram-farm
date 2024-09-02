import { dx, dy } from "@/src/constants/windowSize";
import Building, { BuildingProps } from "./Building";

export default function FarmFence(props: BuildingProps) {
  return (
    <Building
      {...props}
      source={require("@assets/images/buildings/farm-fence.png")}
      width={dx(30) + dy(5)}
      aspectRatio={2}
    />
  );
}
