import { ImageSourcePropType } from "react-native";

export const SEED_TYPES = ["lettuce", "carrot", "tomato", "pineapple"] as const;

export type SeedType = (typeof SEED_TYPES)[number];

export const SEED_BAG_IMAGES: Record<SeedType, ImageSourcePropType> = {
  lettuce: require("@/assets/images/seed-bags/lettuce.png"),
  carrot: require("@/assets/images/seed-bags/carrot.png"),
  tomato: require("@/assets/images/seed-bags/tomato.png"),
  pineapple: require("@/assets/images/seed-bags/pineapple.png"),
};

export type SeedStageImage = {
  source: ImageSourcePropType;
  widthPercentage: number;
  heightPercentage: number;
};

export type PlantedSeed = {
  type: SeedType;
  plantedAt: number;
};

export const SEED_STAGE_IMAGES: Record<
  SeedType,
  [SeedStageImage, SeedStageImage, SeedStageImage, SeedStageImage]
> = {
  lettuce: [
    {
      source: require("@/assets/images/seed-stages/lettuce-1.png"),
      widthPercentage: 15,
      heightPercentage: 15,
    },
    {
      source: require("@/assets/images/seed-stages/lettuce-2.png"),
      widthPercentage: 20,
      heightPercentage: 20,
    },
    {
      source: require("@/assets/images/seed-stages/lettuce-3.png"),
      widthPercentage: 28,
      heightPercentage: 28,
    },
    {
      source: require("@/assets/images/seed-stages/lettuce-4.png"),
      widthPercentage: 40,
      heightPercentage: 40,
    },
  ],
  carrot: [
    {
      source: require("@/assets/images/seed-stages/carrot-1.png"),
      widthPercentage: 15,
      heightPercentage: 15,
    },
    {
      source: require("@/assets/images/seed-stages/carrot-2.png"),
      widthPercentage: 30,
      heightPercentage: 30,
    },
    {
      source: require("@/assets/images/seed-stages/carrot-3.png"),
      widthPercentage: 40,
      heightPercentage: 40,
    },
    {
      source: require("@/assets/images/seed-stages/carrot-4.png"),
      widthPercentage: 55,
      heightPercentage: 55,
    },
  ],
  tomato: [
    {
      source: require("@/assets/images/seed-stages/tomato-1.png"),
      widthPercentage: 20,
      heightPercentage: 20,
    },
    {
      source: require("@/assets/images/seed-stages/tomato-2.png"),
      widthPercentage: 30,
      heightPercentage: 30,
    },
    {
      source: require("@/assets/images/seed-stages/tomato-3.png"),
      widthPercentage: 45,
      heightPercentage: 45,
    },
    {
      source: require("@/assets/images/seed-stages/tomato-4.png"),
      widthPercentage: 70,
      heightPercentage: 70,
    },
  ],
  pineapple: [
    {
      source: require("@/assets/images/seed-stages/pineapple-1.png"),
      widthPercentage: 15,
      heightPercentage: 15,
    },
    {
      source: require("@/assets/images/seed-stages/pineapple-2.png"),
      widthPercentage: 20,
      heightPercentage: 20,
    },
    {
      source: require("@/assets/images/seed-stages/pineapple-3.png"),
      widthPercentage: 28,
      heightPercentage: 28,
    },
    {
      source: require("@/assets/images/seed-stages/pineapple-4.png"),
      widthPercentage: 45,
      heightPercentage: 65,
    },
  ],
};

export const SEED_GROWTH_TIME: Record<SeedType, number> = {
  lettuce: 30000,
  carrot: 60000,
  tomato: 120000,
  pineapple: 300000,
};
