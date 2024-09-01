import Building, { BuildingProps } from "./Building";

export default function FarmPlants(props: BuildingProps) {
  return (
    <Building
      {...props}
      source={require("@assets/images/buildings/farm-plants.png")}
      width={310}
      aspectRatio={1.272}
    />
  );
}
