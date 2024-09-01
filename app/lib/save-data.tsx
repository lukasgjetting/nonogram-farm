import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const SAVE_DATA_ASYNC_STORAGE_KEY = "nonogramFarm:saveData";

export const INTRO_STEPS = [
  "sun",
  "house",
  "tree",
  "flower",
  "lake",
  "farm",
] as const;

export type IntroStep = (typeof INTRO_STEPS)[number];

export type SaveData = {
  hasCompletedNonogramTutorial: boolean;
  introNextStep: IntroStep | null;
};

const initialData: SaveData = {
  introNextStep: "sun",
  hasCompletedNonogramTutorial: false,
};

type SaveDataContextValue = {
  saveData: SaveData | null;
  updateSaveData: <TKey extends keyof SaveData>(
    key: TKey,
    value: SaveData[TKey],
  ) => void;
};

const SaveDataContext = createContext<SaveDataContextValue>({
  saveData: null,
  updateSaveData: () => {},
});

export function useSaveData() {
  const { saveData, updateSaveData } = useContext(SaveDataContext);

  if (saveData == null) {
    throw new Error(
      "useSaveData must not be used before SaveDataProvider has initialized",
    );
  }

  return [saveData, updateSaveData] as const;
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

  const updateSaveData: SaveDataContextValue["updateSaveData"] = (
    key,
    value,
  ) => {
    setSaveData((prev) => {
      if (prev == null) {
        return null;
      }

      const newData = {
        ...prev,
        [key]: initialData[key],
      };

      AsyncStorage.setItem(
        SAVE_DATA_ASYNC_STORAGE_KEY,
        JSON.stringify(newData),
      );

      return newData;
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const existingSave = await AsyncStorage.getItem(
          SAVE_DATA_ASYNC_STORAGE_KEY,
        );

        if (existingSave) {
          setSaveData(JSON.parse(existingSave));
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

  return (
    <SaveDataContext.Provider value={{ saveData, updateSaveData }}>
      {children}
    </SaveDataContext.Provider>
  );
}
