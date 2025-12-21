import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlantedSeed, SeedType } from "../constants/seeds";
const SAVE_DATA_ASYNC_STORAGE_KEY = "nonogramFarm:saveData";

export const INTRO_STEPS = ["sun", "house", "plants", "farm"] as const;
export type IntroStep = (typeof INTRO_STEPS)[number];

export type BuildingType = "art-gallery";

export type SaveData = {
  hasCompletedNonogramTutorial: boolean;
  hasCompletedInventoryTutorial: boolean;
  hasCompletedShopTutorial: boolean;
  introNextStep: IntroStep | null;
  seeds: Partial<Record<SeedType, number>>;
  points: number;
  coins: number;
  plantedSeed: PlantedSeed | null;
  nonograms: number;
  buildings: Partial<Record<BuildingType, boolean>>;
};

export type UpdateSaveData = <TKey extends keyof SaveData>(
  key: TKey,
  value: SaveData[TKey],
) => void;

const initialData: SaveData = {
  introNextStep: "sun",
  hasCompletedNonogramTutorial: false,
  hasCompletedInventoryTutorial: false,
  hasCompletedShopTutorial: false,
  seeds: { lettuce: 10 },
  points: 0,
  coins: 0,
  plantedSeed: null,
  nonograms: 0,
  buildings: {},
};

type SaveDataContextValue = {
  saveData: SaveData | null;
  updateSaveData: UpdateSaveData;
  replaceSaveData: (saveData: SaveData) => void;
};

const SaveDataContext = createContext<SaveDataContextValue>({
  saveData: null,
  updateSaveData: () => {},
  replaceSaveData: () => {},
});

export function useSaveData() {
  const { saveData, updateSaveData, replaceSaveData } = useContext(SaveDataContext);

  if (saveData == null) {
    throw new Error(
      "useSaveData must not be used before SaveDataProvider has initialized",
    );
  }

  return [saveData, updateSaveData, { replaceSaveData }] as const;
}

type SaveDataProviderProps = {
  onLoaded: () => void;
  children: React.ReactNode;
};

export function SaveDataProvider({
  onLoaded,
  children,
}: SaveDataProviderProps) {
  const [saveData, setSaveData] = useState<SaveData | null>(null);

  const replaceSaveData: SaveDataContextValue["replaceSaveData"] = useCallback((newData) => {
    setSaveData((prev) => {
      if (prev == null) {
        return null;
      }

      AsyncStorage.setItem(
        SAVE_DATA_ASYNC_STORAGE_KEY,
        JSON.stringify(newData),
      );

      return newData;
    });
  }, []);

  const updateSaveData: SaveDataContextValue["updateSaveData"] = useCallback((
    key,
    value,
  ) => {
    setSaveData((prev) => {
      if (prev == null) {
        return null;
      }

      const newData = {
        ...prev,
        [key]: value,
      };

      AsyncStorage.setItem(
        SAVE_DATA_ASYNC_STORAGE_KEY,
        JSON.stringify(newData),
      );

      return newData;
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const existingSave = await AsyncStorage.getItem(
          SAVE_DATA_ASYNC_STORAGE_KEY,
        );

        if (existingSave) {
          console.log("existingSave", existingSave,  {...initialData, ...JSON.parse(existingSave) });
          setSaveData({ ...initialData, ...JSON.parse(existingSave) });
        } else {
          setSaveData(initialData);
        }
      } catch (e: any) {
        console.error("Failed to init save data", e);
        setSaveData(initialData);
      }

      onLoaded();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = useMemo(() => ({ saveData, updateSaveData, replaceSaveData: setSaveData }), [saveData, updateSaveData, replaceSaveData]);

  return (
    <SaveDataContext.Provider value={contextValue}>
      {children}
    </SaveDataContext.Provider>
  );
}
