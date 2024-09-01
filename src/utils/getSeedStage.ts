import { PlantedSeed, SEED_GROWTH_TIME } from "../constants/seeds";
import { SaveData } from "../lib/save-data";

const getSeedStage = (seed: PlantedSeed) => {
  const growthTime = Date.now() - seed.plantedAt;
  const timePerStage = SEED_GROWTH_TIME[seed.type] / 3;

  const stage = Math.floor(growthTime / timePerStage);
  console.log({ growthTime, timePerStage, stage });
  return Math.min(3, stage);
};

export default getSeedStage;
