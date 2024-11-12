import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import * as Scanner from './modules/scanner';

export default function App() {
  const [uri, setUri] = useState("");

  useEffect(() => {
    const subscription = Scanner.addListener("onChange", (event: any) => {
      if (event.error) {
        console.error('Scan error:', event.error);
      } else if (event.value) {
        console.log('Scan successful:', event.value);
        setUri(event.value);
      }
    });
  
    return () => {
      subscription.remove();
    };
  }, []);

  const handleScan = async () => {
    try {
      console.log('Scan button pressed'); // Add this debug log
      await Scanner.scan();
    } catch (error) {
      console.error('Scanning failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      
      {/* Make the button more prominent */}
      <TouchableOpacity 
        onPress={handleScan}
        style={styles.scanButton}
      >
        <Text style={styles.scanButtonText}>Scan</Text>
      </TouchableOpacity>

      {uri ? (
        <Image 
          source={{ uri }} 
          style={styles.image} 
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.noImageText}>No image scanned yet</Text>
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
    padding: 20,
  },
  headerText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    minWidth: 150,
  },
  scanButtonText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
  noImageText: {
    marginTop: 20,
    color: '#666',
  },
});