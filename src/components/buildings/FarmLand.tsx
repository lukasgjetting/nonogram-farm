import Building, { BuildingProps } from "./Building";

const ASPECT_RATIO = 1.221;
const WIDTH = 85;
const HEIGHT = WIDTH / ASPECT_RATIO;

export default function FarmLand({ dropDelay, x, y, ...props }: BuildingProps) {
  let renderedFarmLands = 0;
  const renderSingleFarmLand = (offset: { x: number; y: number }) => {
    const delay = (dropDelay ?? 0) + renderedFarmLands * 150;

    renderedFarmLands += 1;

    const xOffset = offset.x * 0.62 * WIDTH + offset.y * 0.38 * WIDTH;
    const yOffset = offset.x * -0.204 * HEIGHT + offset.y * 0.275 * HEIGHT;

    return (
      <Building
        {...props}
        dropDelay={delay}
        source={require("@assets/images/buildings/farm-land.png")}
        width={WIDTH}
        aspectRatio={ASPECT_RATIO}
        x={x + xOffset}
        y={y + yOffset}
      />
    );
  };
  return (
    <>
      {renderSingleFarmLand({ x: 0, y: 0 })}
      {renderSingleFarmLand({ x: 1, y: 0 })}
      {renderSingleFarmLand({ x: 2, y: 0 })}
      {renderSingleFarmLand({ x: 0, y: 1 })}
      {renderSingleFarmLand({ x: 1, y: 1 })}
      {renderSingleFarmLand({ x: 2, y: 1 })}
    </>
  );
}
