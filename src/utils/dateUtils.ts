// src/dateUtils.ts
import { PCFLineItem } from '../types';

export const calculateExpirationDate = (bestBefore: string, days: string): Date => {
    // Remove asterisk if present for calculation
    const daysCount = parseInt(days.replace('*', ''));
    const [day, month, year] = bestBefore.split('/').map(num => parseInt(num));
    
    // Create date from bestBefore and add days
    const expirationDate = new Date(year, month - 1, day);
    expirationDate.setDate(expirationDate.getDate() + daysCount);
    
    return expirationDate;
};
  
export const daysUntilExpiration = (expirationDate: Date): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    
    const diff = expirationDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
  
export const isInCreditWindow = (
    expirationDate: Date, 
    windowBefore: number = 3, 
    windowAfter: number = 2
): boolean => {
    const daysLeft = daysUntilExpiration(expirationDate);
    return daysLeft >= -windowAfter && daysLeft <= windowBefore;
};
  
export const shouldDeletePCF = (
    lineItems: PCFLineItem[], 
    deleteDays: number
): boolean => {
    // Only delete if all items are past deletion threshold
    return lineItems.every(item => {
        if (!item.expirationDate) return false;
        const daysLeft = daysUntilExpiration(item.expirationDate);
        return daysLeft < -deleteDays;
    });
};
  
export const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};