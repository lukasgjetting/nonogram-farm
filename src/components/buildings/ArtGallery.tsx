import { dx } from "@/src/constants/windowSize";
import Building, { BuildingProps } from "./Building";

export default function ArtGallery(props: BuildingProps) {
  return (
    <Building
      {...props}
      source={require("@assets/images/buildings/art-gallery.png")}
      width={dx(53)}
      aspectRatio={1.221}
    />
  );
}
