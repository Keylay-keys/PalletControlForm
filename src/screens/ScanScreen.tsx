import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHaptics } from '../hooks/useHaptics';
import { processImage } from 'modules/ocr';
import { scan, addListener } from 'modules/scanner'; // Import scanning functionality
import { ErrorDisplay } from '../components/Scanner/ErrorDisplay';
import { ResultsView } from '../components/Scanner/ResultsView';

export const ScanScreen: React.FC = () => {
  const [scanUri, setScanUri] = useState<string | null>(null);
  const [groupingType, setGroupingType] = useState<'order' | 'container' | null>(null);
  const [lineItems, setLineItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const { successFeedback, errorFeedback } = useHaptics();

  useEffect(() => {
    // Handle scanning events
    const subscription = addListener('onChange', (data: any) => {
      if (data.type === 'cancelled') {
        setScanning(false);
        return;
      }

      if (data.type === 'error') {
        setError(data.message || 'Scan failed');
        setScanning(false);
        return;
      }

      if (data.value) {
        setScanUri(data.value);
        setScanning(false);
      }
    });

    return () => subscription.remove();
  }, []);

  const resetGrouping = (type: 'order' | 'container') => {
    setGroupingType(type);
    setScanUri(null);
    setLineItems([]);
    setError(null);
    console.log(`[ScanScreen] Starting new ${type}`);
  };

  const handleScan = async () => {
    try {
      setScanning(true);
      setError(null);
      await scan(); // Trigger scanning functionality
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scanner error');
      setScanning(false);
    }
  };

  const handleScanComplete = async () => {
    if (!scanUri) {
      Alert.alert('Error', 'Please scan an image first');
      return;
    }

    try {
      const result = await processImage(scanUri);
      const parsedResult = JSON.parse(result);
      setLineItems(parsedResult.lineItems || []);
      successFeedback();
    } catch (err) {
      console.error('[ScanScreen] Error processing scan:', err);
      setError('Failed to process scan.');
      errorFeedback();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => resetGrouping('order')}>
          <Text style={styles.menuButton}>New Order</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => resetGrouping('container')}>
          <Text style={styles.menuButton}>New Container</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {groupingType ? (
          <>
            <Text style={styles.groupingText}>
              {groupingType === 'order' ? 'Order Grouping' : 'Container Grouping'}
            </Text>
            {scanUri ? (
              <>
                <Text style={styles.infoText}>Scanned Image:</Text>
                <ResultsView lineItems={lineItems} visible={true} />
                <TouchableOpacity
                  style={styles.processButton}
                  onPress={handleScanComplete}
                >
                  <Text style={styles.buttonText}>Process Scan</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.scanButton}
                onPress={handleScan}
                disabled={scanning}
              >
                <Text style={styles.buttonText}>
                  {scanning ? 'Scanning...' : 'Scan Now'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text style={styles.infoText}>
            Select "New Order" or "New Container" to start scanning.
          </Text>
        )}
      </View>

      {error && <ErrorDisplay message={error} onDismiss={() => setError(null)} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  menuButton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  groupingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  infoText: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },
  scanButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  processButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#34C759',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
