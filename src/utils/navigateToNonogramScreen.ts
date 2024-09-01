import { NonogramKey } from "@/src/constants/nonograms.generated";
import { router } from "expo-router";

const navigateToNonogramScreen = (srcKey: NonogramKey) => {
  router.navigate(`/nonogram/${srcKey}`);
};

export default navigateToNonogramScreen;
