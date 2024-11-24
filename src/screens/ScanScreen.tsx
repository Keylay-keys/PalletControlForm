import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { scan, addListener } from '../../modules/scanner';
import { processImage } from '../../modules/ocr';
import { PCFScanResult } from '../types';
import { ScanButton } from '../components/Scanner/ScanButton';
import { PreviewImage } from '../components/Scanner/PreviewImage';
import { OCRResults } from '../components/Scanner/OCRResults';
import { ErrorDisplay, Button } from '../components/common';
import { useNavigation } from '../navigation';
import { Ionicons } from '@expo/vector-icons';

type ScanEventData = {
  value?: string;
  type?: 'cancelled' | 'error';
  message?: string;
};

export default function ScanScreen() {
  const { navigate } = useNavigation();
  const [uri, setUri] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<PCFScanResult | null>(null);

  const navigateToDashboard = useCallback(() => {
    setScanning(false);
    setUri("");
    setError(null);
    setOcrResult(null);
    navigate('Dashboard');
  }, [navigate]);

  const handleClose = () => {
    navigateToDashboard();
  };

  useEffect(() => {
    let mounted = true;
    
    const scanSubscription = addListener('onChange', (data: ScanEventData) => {
      if (!mounted) return;

      console.log('Scan event:', data);
      
      if (data.type === 'cancelled') {
        navigateToDashboard();
        return;
      }
      
      if (data.type === 'error') {
        setError(data.message || 'Scan failed');
        navigateToDashboard();
        return;
      }

      if (data.value) {
        setUri(data.value);
        setScanning(false);
      }
    });

    const startScanning = async () => {
      if (!mounted) return;
      
      try {
        setScanning(true);
        setError(null);
        await scan();
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Scanner error');
          setScanning(false);
          navigateToDashboard();
        }
      }
    };

    startScanning();

    return () => {
      mounted = false;
      scanSubscription.remove();
      setScanning(false);
      setUri("");
      setError(null);
      setOcrResult(null);
    };
  }, [navigateToDashboard]);

  const handleProcess = async () => {
    if (!uri) {
      setError("No image to process");
      return;
    }

    try {
      console.log('Starting OCR processing for:', uri);
      const rawResult = await processImage(uri);
      console.log('Raw OCR Result:', rawResult);

      const transformedResult: PCFScanResult = {
        lineItems: rawResult.lineItems.map(item => {
          const lineItem = {
            ...item,
            isShortCoded: item.days?.includes('*') || false,
            expirationDate: undefined,
            daysUntilExpiration: undefined,
            customAlertDays: undefined
          };
          console.log('Processed line item:', lineItem);
          return lineItem;
        }),
        containerCode: rawResult.containerCode || '',
        pageInfo: rawResult.pageInfo?.current && rawResult.pageInfo?.total ? 
          rawResult.pageInfo : undefined
      };
      
      console.log("Final OCR result:", {
        containerCode: transformedResult.containerCode,
        pageInfo: transformedResult.pageInfo,
        lineItemCount: transformedResult.lineItems.length
      });
      
      setOcrResult(transformedResult);
    } catch (err) {
      console.error("OCR processing error:", err);
      setError(err instanceof Error ? err.message : 'OCR processing error');
    }
  };

  const resetScan = async () => {
    setUri("");
    setError(null);
    setOcrResult(null);
    setScanning(true);

    try {
      await scan();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scanner error');
      setScanning(false);
    }
  };

  return (
    <View style={styles.container}>
      {error && <ErrorDisplay message={error} onDismiss={() => setError(null)} />}
      
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={handleClose}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={24} color="#e2e8f0" />
      </TouchableOpacity>

      <View style={styles.content}>
        {uri ? (
          <View style={styles.previewContainer}>
            <PreviewImage uri={uri} />
            {ocrResult && <OCRResults result={ocrResult} />}
          </View>
        ) : (
          <View style={styles.scanContainer}>
            {scanning && (
              <Text style={styles.instruction}>
                Scanning in progress...
              </Text>
            )}
          </View>
        )}
      </View>

      {uri && (
        <View style={styles.bottomBar}>
          <Button 
            title="Retake"
            onPress={resetScan}
            style={styles.retakeButton}
            icon="refresh"
          />
          <Button
            title="Process"
            onPress={handleProcess}
            style={styles.processButton}
            icon="checkmark-circle"
          />
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderColor: '#334155',
  },
  retakeButton: {
    backgroundColor: '#64748b',
    flex: 1,
    marginRight: 8,
  },
  processButton: {
    backgroundColor: '#22c55e',
    flex: 1,
    marginLeft: 8,
  },
  scanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0f172a',
  },
  instruction: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});