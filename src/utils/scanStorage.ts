// src/utils/scanStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProcessedResult } from './scanProcessor';

interface ScanGroup {
 orderNumber: string;
 containerCode: string;
 scans: Array<{
   uri: string;
   pageNumber: number;
   timestamp: number;
   result: ProcessedResult;
 }>;
 createdAt: number;
 updatedAt: number;
}

export class ScanStorageManager {
 private static STORAGE_KEY_PREFIX = '@pcf_scan_';
 private static GROUP_INDEX_KEY = '@pcf_scan_groups';

 static async saveScan(
   uri: string,
   result: ProcessedResult
 ): Promise<void> {
   try {
     const { orderNumber, containerCode } = result;
     if (!orderNumber || !containerCode) {
       throw new Error('Invalid scan result: missing orderNumber or containerCode');
     }

     const groupKey = `${orderNumber}_${containerCode}`;
     const existingGroup = await this.getScanGroup(groupKey);

     const scan = {
       uri,
       pageNumber: result.pageInfo.current,
       timestamp: Date.now(),
       result
     };

     if (existingGroup) {
       // Update existing group
       existingGroup.scans.push(scan);
       existingGroup.updatedAt = Date.now();
       await this.saveScanGroup(groupKey, existingGroup);
     } else {
       // Create new group
       const newGroup: ScanGroup = {
         orderNumber,
         containerCode,
         scans: [scan],
         createdAt: Date.now(),
         updatedAt: Date.now()
       };
       await this.saveScanGroup(groupKey, newGroup);
       await this.addToGroupIndex(groupKey);
     }
   } catch (error) {
     console.error('Failed to save scan:', error);
     throw error;
   }
 }

 static async getScanGroup(groupKey: string): Promise<ScanGroup | null> {
   try {
     const data = await AsyncStorage.getItem(this.STORAGE_KEY_PREFIX + groupKey);
     return data ? JSON.parse(data) : null;
   } catch (error) {
     console.error('Failed to get scan group:', error);
     return null;
   }
 }

 private static async saveScanGroup(groupKey: string, group: ScanGroup): Promise<void> {
   try {
     await AsyncStorage.setItem(
       this.STORAGE_KEY_PREFIX + groupKey,
       JSON.stringify(group)
     );
   } catch (error) {
     console.error('Failed to save scan group:', error);
     throw error;
   }
 }

 private static async addToGroupIndex(groupKey: string): Promise<void> {
   try {
     const existingIndex = await this.getGroupIndex();
     if (!existingIndex.includes(groupKey)) {
       existingIndex.push(groupKey);
       await AsyncStorage.setItem(
         this.GROUP_INDEX_KEY,
         JSON.stringify(existingIndex)
       );
     }
   } catch (error) {
     console.error('Failed to update group index:', error);
     throw error;
   }
 }

 private static async getGroupIndex(): Promise<string[]> {
   try {
     const index = await AsyncStorage.getItem(this.GROUP_INDEX_KEY);
     return index ? JSON.parse(index) : [];
   } catch (error) {
     console.error('Failed to get group index:', error);
     return [];
   }
 }

 static async getAllGroups(): Promise<ScanGroup[]> {
   try {
     const index = await this.getGroupIndex();
     const groups = await Promise.all(
       index.map(key => this.getScanGroup(key))
     );
     return groups.filter((group): group is ScanGroup => group !== null);
   } catch (error) {
     console.error('Failed to get all groups:', error);
     return [];
   }
 }

 static async deleteGroup(groupKey: string): Promise<void> {
   try {
     await AsyncStorage.removeItem(this.STORAGE_KEY_PREFIX + groupKey);
     const index = await this.getGroupIndex();
     const updatedIndex = index.filter(key => key !== groupKey);
     await AsyncStorage.setItem(
       this.GROUP_INDEX_KEY,
       JSON.stringify(updatedIndex)
     );
   } catch (error) {
     console.error('Failed to delete group:', error);
     throw error;
   }
 }

 static async cleanupOldScans(daysToKeep: number = 7): Promise<void> {
   try {
     const groups = await this.getAllGroups();
     const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);

     for (const group of groups) {
       if (group.updatedAt < cutoffTime) {
         const groupKey = `${group.orderNumber}_${group.containerCode}`;
         await this.deleteGroup(groupKey);
       }
     }
   } catch (error) {
     console.error('Failed to cleanup old scans:', error);
     throw error;
   }
 }
}