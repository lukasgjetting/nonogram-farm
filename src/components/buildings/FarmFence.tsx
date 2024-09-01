import Building, { BuildingProps } from "./Building";

export default function FarmFence(props: BuildingProps) {
  return (
    <Building
      {...props}
      source={require("@assets/images/buildings/farm-fence.png")}
      width={180}
      aspectRatio={2}
    />
  );
}
