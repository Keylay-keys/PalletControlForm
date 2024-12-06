// src/screens/ScannerScreen.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Header } from '../components/Scanner/Header';
import { StatusArea } from '../components/Scanner/StatusArea';
import { PreviewSection } from '../components/Scanner/PreviewSection';
import { ScanButton } from '../components/Scanner/ScanButton';
import { ResultsView } from '../components/Scanner/ResultsView';
import { ProcessingOverlay } from '../components/Scanner/Animations/ProcessingOverlay';
import { ErrorDisplay } from '../components/Scanner/ErrorDisplay';
import { useScanManagement } from '../hooks/useScanManagement';
import { useHaptics } from '../hooks/useHaptics';
import { RootParamList } from '../types';

type ScannerScreenProps = {
  navigation: StackNavigationProp<RootParamList, 'Scanner'>;
};

interface ScanResult {
  uri: string;
  result: {
    lineItems: Array<{
      product: string;
      description: string;
      batch?: string;
      bestBefore?: string;
      days: string;
    }>;
  };
}

interface CurrentGroup {
  orderNumber: string | null;
  containerCode: string | null;
  currentPage: number;
  totalPages: number;
}

export const ScannerScreen: React.FC<ScannerScreenProps> = ({ navigation }) => {
  const {
    loading,
    error,
    currentGroup,
    processedScans,
    processScan,
    startNewGroup,
    updatePageInfo,
    resetError,
  } = useScanManagement();

  const { successFeedback, errorFeedback } = useHaptics();

  const latestScan = processedScans[processedScans.length - 1] as ScanResult | undefined;

  useEffect(() => {
    if (error) {
      errorFeedback();
    }
  }, [error, errorFeedback]);

  const handleScanComplete = async (uri: string) => {
    try {
      await processScan(uri);
      successFeedback();
    } catch (err) {
      console.error('Scan processing failed:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onClose={() => navigation.goBack()} />

      <StatusArea
        orderNumber={currentGroup.orderNumber}
        containerCode={currentGroup.containerCode}
        currentPage={currentGroup.currentPage}
        totalPages={currentGroup.totalPages}
        visible={!!currentGroup.orderNumber}
        onNewScan={startNewGroup}
        onPageUpdate={updatePageInfo}
      />

      <View style={styles.content}>
        {latestScan ? (
          <>
            <PreviewSection 
              uri={latestScan.uri} 
              result={latestScan.result} 
            />
            <ResultsView
              lineItems={latestScan.result.lineItems}
              visible={!loading}
            />
          </>
        ) : (
          <ScanButton 
            onScan={handleScanComplete} 
            disabled={loading}
          />
        )}
      </View>

      {loading && <ProcessingOverlay />}

      {error && (
        <ErrorDisplay 
          message={error} 
          onDismiss={resetError} 
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});