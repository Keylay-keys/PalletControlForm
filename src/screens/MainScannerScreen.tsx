// src/screens/MainScannerScreen.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from '../components/Scanner/StatusBar';
import { ActionBar } from '../components/Scanner/ActionBar';
import { PageIndicator } from '../components/Scanner/PageIndicator';
import { ScanButton } from '../components/Scanner/ScanButton';
import { StatusArea } from '../components/Scanner/StatusArea';
import { PreviewSection } from '../components/Scanner/PreviewSection';
import { LoadingAnimation } from '../components/Scanner/Animations/LoadingAnimation';
import { useScannerLogic } from '../hooks/useScannerLogic';

export const MainScannerScreen = () => {
  const {
    scanning,
    processing,
    uri,
    orderNumber,
    containerCode,
    currentPage,
    totalPages,
    error,
    startScan,
    resetScan
  } = useScannerLogic();

  const handleScanDocument = async () => {
    try {
      await startScan();
    } catch (err) {
      console.error('Scan failed:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar progress={processing ? 0.5 : scanning ? 0.3 : 0} />
      
      <StatusArea
        orderNumber={orderNumber}
        containerCode={containerCode}
        currentPage={currentPage}
        totalPages={totalPages}
        visible={!!orderNumber}
      />

      <View style={styles.mainContent}>
        {uri ? (
          <PreviewSection
            uri={uri}
            onRetake={resetScan}  // Changed from onProcess to onRetake
            processing={processing}
          />
        ) : (
          <ScanButton 
            onPress={handleScanDocument}  // Changed from onScan to onPress
            scanning={scanning}
          />
        )}

        <PageIndicator 
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </View>

      <ActionBar 
        onScan={handleScanDocument}
        onDocuments={() => {}}
      />

      {scanning && <LoadingAnimation />}
      {processing && (
        <View style={styles.processingOverlay}>
          <LoadingAnimation />
          <Text style={styles.processingText}>Processing scan...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  errorOverlay: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    padding: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    borderRadius: 8,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
});