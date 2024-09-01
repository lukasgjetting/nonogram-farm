import { SEED_GROWTH_TIME } from "../constants/seeds";
import { useSaveData } from "../lib/save-data";
import getSeedStage from "./getSeedStage";

const GROWTH_TIME_TO_POINTS_FACTOR = 0.007;
const POINTS_VARIATION = 0.2;

const GROWTH_TIME_TO_COINS_FACTOR = 0.001;

const useHarvest = () => {
  const [{ plantedSeed, points, coins }, updateSaveData] = useSaveData();

  const harvest = () => {
    if (plantedSeed == null) {
      return;
    }

    const stage = getSeedStage(plantedSeed);

    if (stage < 3) {
      return;
    }

    const totalGrowthTime = SEED_GROWTH_TIME[plantedSeed.type];

    const pointsRandom = Math.random();

    const pointsEarned = Math.round(
      totalGrowthTime *
        GROWTH_TIME_TO_POINTS_FACTOR *
        (1 + (pointsRandom - 0.5) * 2 * POINTS_VARIATION),
    );

    const coinsEarned = Math.round(
      totalGrowthTime * GROWTH_TIME_TO_COINS_FACTOR,
    );

    updateSaveData("plantedSeed", null);
    updateSaveData("points", points + pointsEarned);
    updateSaveData("coins", coins + coinsEarned);
  };

  return harvest;
};

export default useHarvest;
