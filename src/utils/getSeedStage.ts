import { PlantedSeed, SEED_GROWTH_TIME } from "../constants/seeds";

const getSeedStage = (seed: PlantedSeed) => {
  const growthTime = Date.now() - seed.plantedAt;
  const timePerStage = SEED_GROWTH_TIME[seed.type] / 3;

  const stage = Math.floor(growthTime / timePerStage);
  return Math.min(3, stage);
};

export default getSeedStage;
