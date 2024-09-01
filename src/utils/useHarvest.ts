import { useSaveData } from "../lib/save-data";
import getSeedStage from "./getSeedStage";

const useHarvest = () => {
  const [{ plantedSeed }, updateSaveData] = useSaveData();

  const harvest = () => {
    if (plantedSeed == null) {
      return;
    }

    const stage = getSeedStage(plantedSeed);

    if (stage < 3) {
      return;
    }

    updateSaveData("plantedSeed", null);
  };

  return harvest;
};

export default useHarvest;
