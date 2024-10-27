import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { scan, addChangeListener } from "./modules/mymodule";
import { useEffect, useState } from "react";

export default function App() {
  const [uri, seturi] = useState("");

  useEffect(() => {
    const subscription = addChangeListener((data) => {
      console.log(data.value);
      seturi(data.value);
    });

    return () => subscription.remove();
  },[]);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <TouchableOpacity onPress={scan}>
        <Text style={{ fontSize: 30, color: "red"}}>Scan</Text>
      </TouchableOpacity>
      {uri !== "" && (
      <Image source={{ uri: uri}} style={{ width: 300, height: 300}} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
