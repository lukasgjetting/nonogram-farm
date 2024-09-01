import Building, { BuildingProps } from "./Building";

export default function House(props: BuildingProps) {
  return (
    <Building
      {...props}
      source={require("@assets/images/buildings/house.png")}
      width={230}
      aspectRatio={1.221}
    />
  );
}
