import { NonogramKey } from "@/constants/nonograms.generated";

const getNonogramHref = (srcKey: NonogramKey) => {
  return `/nonogram/${srcKey}` as const;
};

export default getNonogramHref;
