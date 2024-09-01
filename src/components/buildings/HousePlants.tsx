import Building, { BuildingProps } from "./Building";

export default function HousePlants(props: BuildingProps) {
  return (
    <Building
      {...props}
      source={require("@assets/images/buildings/house-plants.png")}
      width={180}
      aspectRatio={1.093}
    />
  );
}
