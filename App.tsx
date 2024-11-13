// App.tsx
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { scan, addListener } from './modules/scanner';  // Changed from addChangeListener
import { processImage } from './modules/ocr';
import { OCRResult } from './modules/ocr/src/Ocr.types';  // Only import what you're using

export default function App() {
  const [uri, setUri] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);

  useEffect(() => {
    const subscription = addListener('onChange', (data) => {  // Changed to use addListener
      console.log('Scan result:', data.value);
      setUri(data.value);
      setScanning(false);
    });

    return () => subscription.remove();
  }, []);

  const handleScan = async () => {
    try {
      setScanning(true);
      setError(null);
      await scan();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scanner error');
      setScanning(false);
    }
  };

  const handleProcess = async () => {
    if (!uri) {
      setError("No image to process");
      return;
    }

    try {
      const result = await processImage(uri);
      console.log("OCR result:", result);
      setOcrResult(result);
    } catch (err) {
      console.error("OCR processing error:", err);
      setError(err instanceof Error ? err.message : 'OCR processing error');
    }
};

  const resetScan = () => {
    setUri("");
    setError(null);
    setOcrResult(null);
  };

  const hasAsterisk = (days: string) => days.includes('*');
  const cleanDays = (days: string) => days.replace('*', '');

  const renderPageInfo = () => {
    if (!ocrResult?.pageInfo) return null;
    return (
      <View style={styles.pageInfoContainer}>
        <Text style={styles.pageInfoText}>
          Page {ocrResult.pageInfo.current} of {ocrResult.pageInfo.total}
        </Text>
      </View>
    );
  };

  const renderOCRResult = () => {
    if (!ocrResult) return null;

    return (
      <ScrollView style={styles.ocrResultContainer}>
        {renderPageInfo()}
        <Text style={styles.containerCodeText}>
          Container Code: {ocrResult.containerCode}
        </Text>
        <Text style={styles.ocrResultText}>Scanned Items:</Text>
        {ocrResult.lineItems.map((item, index) => (
          <View 
            key={index} 
            style={[
              styles.lineItemContainer,
              hasAsterisk(item.days) && styles.asteriskContainer
            ]}
          >
            <View style={styles.lineItemHeader}>
              <Text style={styles.productText}>{item.product}</Text>
              <Text style={styles.daysText}>{cleanDays(item.days)} days</Text>
            </View>
            <Text style={styles.descriptionText}>{item.description}</Text>
            <Text style={styles.dateText}>Best Before: {item.bestBefore}</Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.title}>PCF Scanner</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => setError(null)}>
            <Ionicons name="close-circle" size={24} color="#FF4444" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        {uri ? (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri }}
              style={styles.preview}
              resizeMode="contain"
            />
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.button, styles.retakeButton]}
                onPress={resetScan}
              >
                <Ionicons name="refresh" size={24} color="white" />
                <Text style={styles.buttonText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.processButton]}
                onPress={handleProcess}
              >
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text style={styles.buttonText}>Process</Text>
              </TouchableOpacity>
            </View>
            {renderOCRResult()}
          </View>
        ) : (
          <View style={styles.scanContainer}>
            <TouchableOpacity
              style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
              onPress={handleScan}
              disabled={scanning}
            >
              {scanning ? (
                <Text style={styles.scanButtonText}>Scanning...</Text>
              ) : (
                <>
                  <Ionicons name="scan" size={48} color="white" />
                  <Text style={styles.scanButtonText}>Scan PCF</Text>
                </>
              )}
            </TouchableOpacity>
            <Text style={styles.instruction}>
              Position the PCF within the scanner frame
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Layout Styles
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },

  // Preview Styles
  previewContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  preview: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'white',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    minWidth: 130,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  retakeButton: {
    backgroundColor: '#64748b',
  },
  processButton: {
    backgroundColor: '#22c55e',
  },

  // Scan Container Styles
  scanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scanButton: {
    backgroundColor: '#2563eb',
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginBottom: 20,
  },
  scanButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  scanButtonText: {  // Added this style
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  instruction: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },

  // Error Styles
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE8E8',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  errorText: {
    flex: 1,
    color: '#CC0000',
    marginRight: 10,
  },

  // OCR Result Styles
  ocrResultContainer: {
    maxHeight: 300,
    width: '100%',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  ocrResultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  lineItemContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  asteriskContainer: {
    borderColor: '#ff4444',
    borderWidth: 1,
  },
  lineItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  daysText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: '#666',
  },

  // Progress and Info Styles
  progressContainer: {
    backgroundColor: '#e8f4ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '500',
  },
  completeText: {
    color: '#059669',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  containerCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  pageInfoText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  pageInfoContainer: {
    backgroundColor: '#e8f4ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
});