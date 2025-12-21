import Text from "@/src/components/Text";
import { useSaveData } from "@/src/lib/save-data";
import { useCallback, useMemo, useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";

export default function DevToolsScreen() {
  const [saveData, _setSaveData, { replaceSaveData }] = useSaveData();

  const initialJson = useMemo(
    () => JSON.stringify(saveData, null, 2),
    [saveData],
  );
  const [json, setJson] = useState(initialJson);

  const save = useCallback(() => {
    try {
      const newSaveData = JSON.parse(json);
      replaceSaveData(newSaveData);
    } catch (error) {
      Alert.alert("Failed to save", (error as Error).message);
    }
  }, [json, replaceSaveData]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        multiline
        value={json}
        onChangeText={setJson}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          borderColor: "#ccc",
          backgroundColor: "#fcfcfc",
          padding: 8,
        }}
      />
      <Button title="Save" disabled={json === initialJson} onPress={save} />
    </View>
  );
}
