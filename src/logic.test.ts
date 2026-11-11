import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRemainingChats,
  calculateEqubPayout,
  calculateEqubProgress,
  calculateEthiopianTax,
  calculateNetProfit,
  isNotificationAvailable,
  REQUIRED_AMHARIC_AI_TERM,
  PLAN_CONFIG
} from './logic';

test('Plan configuration contains exact prices and limits', () => {
  assert.equal(PLAN_CONFIG.free.dailyLimit, 12);
  assert.equal(PLAN_CONFIG.premium.dailyLimit, 50);
  assert.equal(PLAN_CONFIG.premium.priceMonthly, 250);
  assert.equal(PLAN_CONFIG.premium.priceAnnual, 2700);
  assert.equal(PLAN_CONFIG.business.priceMonthly, 600);
  assert.equal(PLAN_CONFIG.business.priceAnnual, 6480);
});

test('calculateRemainingChats handles free, premium and business tiers', () => {
  assert.equal(calculateRemainingChats('free', 5), 7);
  assert.equal(calculateRemainingChats('free', 12), 0);
  assert.equal(calculateRemainingChats('free', 15), 0);
  assert.equal(calculateRemainingChats('premium', 20), 30);
  assert.equal(calculateRemainingChats('business', 100), 'unlimited');
});

test('Equb calculations compute round payouts and progress correctly', () => {
  assert.equal(calculateEqubPayout(5000, 12), 60000);
  assert.equal(calculateEqubPayout(0, 10), 0);
  assert.equal(calculateEqubProgress(4, 12), 33);
  assert.equal(calculateEqubProgress(12, 12), 100);
});

test('Ethiopian tax and net profit calculations align with VAT 15% and TOT 2%', () => {
  const sales = 100000;
  const cogs = 40000;
  const opex = 20000;

  // 15% VAT
  const vat = calculateEthiopianTax(sales, 'vat');
  assert.equal(vat, 15000);
  const netVat = calculateNetProfit(sales, cogs, opex, 'vat');
  assert.equal(netVat, 25000);

  // 2% TOT
  const tot = calculateEthiopianTax(sales, 'tot');
  assert.equal(tot, 2000);
  const netTot = calculateNetProfit(sales, cogs, opex, 'tot');
  assert.equal(netTot, 38000);
});

test('Notification availability respects plan delay tiers (Free: 8h, Premium: 1h, Business: 0h)', () => {
  const now = Date.now();
  const twoHoursAgo = now - (2 * 60 * 60 * 1000);
  const tenHoursAgo = now - (10 * 60 * 60 * 1000);

  // Business sees it immediately
  assert.equal(isNotificationAvailable(twoHoursAgo, 'business', now), true);
  // Premium sees it after 1 hour (2h >= 1h)
  assert.equal(isNotificationAvailable(twoHoursAgo, 'premium', now), true);
  // Free does NOT see 2-hour old notification (needs 8h)
  assert.equal(isNotificationAvailable(twoHoursAgo, 'free', now), false);
  // Free DOES see 10-hour old notification
  assert.equal(isNotificationAvailable(tenHoursAgo, 'free', now), true);
});

test('Amharic term for Artificial Intelligence strictly matches requirement', () => {
  assert.equal(REQUIRED_AMHARIC_AI_TERM, "አርቲፊሻል ኢንተለጀንስ");
});
