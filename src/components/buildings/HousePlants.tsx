import { dx } from "@/src/constants/windowSize";
import Building, { BuildingProps } from "./Building";

export default function HousePlants(props: BuildingProps) {
  return (
    <Building
      {...props}
      source={require("@assets/images/buildings/house-plants.png")}
      width={dx(41.48)}
      aspectRatio={1.093}
    />
  );
}
