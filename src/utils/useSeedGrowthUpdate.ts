import { useEffect, useState } from "react";
import { PlantedSeed, SEED_GROWTH_TIME } from "../constants/seeds";
import getSeedStage from "./getSeedStage";

const useSeedGrowthUpdate = (seed: PlantedSeed | null) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_randomState, setRandomState] = useState(0);

  const currentGrowthStage = seed != null ? getSeedStage(seed) : null;

  useEffect(() => {
    if (seed == null || currentGrowthStage == null || currentGrowthStage >= 3) {
      return undefined;
    }

    const timePerStage = SEED_GROWTH_TIME[seed.type] / 3;
    const currentTime = (Date.now() - seed.plantedAt) % timePerStage;

    const timeoutId = setTimeout(
      () => {
        setRandomState(Math.random());
      },
      Math.max(5, timePerStage - currentTime + 1000),
    );

    return () => clearTimeout(timeoutId);
  }, [seed, currentGrowthStage]);
};

export default useSeedGrowthUpdate;
