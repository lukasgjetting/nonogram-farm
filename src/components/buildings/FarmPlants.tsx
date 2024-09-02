import { dx, dy } from "@/src/constants/windowSize";
import Building, { BuildingProps } from "./Building";

export default function FarmPlants(props: BuildingProps) {
  return (
    <Building
      {...props}
      source={require("@assets/images/buildings/farm-plants.png")}
      width={dx(40) + dy(15)}
      aspectRatio={1.272}
    />
  );
}
