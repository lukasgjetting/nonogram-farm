import { dx } from "@/src/constants/windowSize";
import Building, { BuildingProps } from "./Building";

export default function House(props: BuildingProps) {
  return (
    <Building
      {...props}
      source={require("@assets/images/buildings/house.png")}
      width={dx(53)}
      aspectRatio={1.221}
    />
  );
}
