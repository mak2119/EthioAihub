/**
 * ETHIO AI HUB - Pure Business & Verification Logic
 */

export interface UserPlanInfo {
  dailyLimit: number;
  notificationDelayHours: number;
  priceMonthly: number;
  priceAnnual: number;
}

export const PLAN_CONFIG: Record<string, UserPlanInfo> = {
  free: {
    dailyLimit: 12,
    notificationDelayHours: 8,
    priceMonthly: 0,
    priceAnnual: 0
  },
  premium: {
    dailyLimit: 50,
    notificationDelayHours: 1,
    priceMonthly: 250,
    priceAnnual: 2700 // 10% annual discount
  },
  business: {
    dailyLimit: Infinity,
    notificationDelayHours: 0,
    priceMonthly: 600,
    priceAnnual: 6480 // 10% annual discount
  }
};

export function calculateRemainingChats(plan: string, currentUsage: number): number | 'unlimited' {
  const config = PLAN_CONFIG[plan] || PLAN_CONFIG.free;
  if (config.dailyLimit === Infinity) return 'unlimited';
  return Math.max(0, config.dailyLimit - currentUsage);
}

export function calculateEqubPayout(roundAmount: number, membersCount: number): number {
  if (roundAmount <= 0 || membersCount <= 0) return 0;
  return roundAmount * membersCount;
}

export function calculateEqubProgress(paidRounds: number, totalRounds: number): number {
  if (totalRounds <= 0) return 0;
  return Math.min(100, Math.round((paidRounds / totalRounds) * 100));
}

export function calculateEthiopianTax(sales: number, taxType: 'vat' | 'tot' | 'none'): number {
  if (sales <= 0) return 0;
  if (taxType === 'vat') return sales * 0.15; // 15% VAT
  if (taxType === 'tot') return sales * 0.02; // 2% TOT on goods
  return 0;
}

export function calculateNetProfit(sales: number, cogs: number, opex: number, taxType: 'vat' | 'tot' | 'none'): number {
  const gross = sales - cogs;
  const tax = calculateEthiopianTax(sales, taxType);
  return gross - opex - tax;
}

export function isNotificationAvailable(notificationTimeMs: number, plan: string, currentTimeMs: number = Date.now()): boolean {
  const config = PLAN_CONFIG[plan] || PLAN_CONFIG.free;
  const ageHours = (currentTimeMs - notificationTimeMs) / (1000 * 60 * 60);
  return ageHours >= config.notificationDelayHours;
}

export const REQUIRED_AMHARIC_AI_TERM = "አርቲፊሻል ኢንተለጀንስ";
