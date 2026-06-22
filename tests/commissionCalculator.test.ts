import { describe, expect, it } from 'vitest';
import { calculateCommission, findCommissionBand, formatGBP } from '../src/commissionCalculator';

describe('commission calculator', () => {
  it('returns no commission below 13% gross margin', () => {
    const result = calculateCommission({
      contractValue: 10_000_000,
      grossMarginPercent: 12.99,
      salesCreditPercent: 100,
      approvalStatus: 'approved',
      conditionsStatus: 'cleared',
    });

    expect(result.totalIndicativeCommission).toBe(0);
    expect(result.payableAtSignature).toBe(false);
    expect(result.warnings).toContain('No commission is payable below 13% gross margin.');
  });

  it('calculates £15m at 13% gross margin and 100% sales credit', () => {
    const result = calculateCommission({
      contractValue: 15_000_000,
      grossMarginPercent: 13,
      salesCreditPercent: 100,
      approvalStatus: 'approved',
      conditionsStatus: 'cleared',
    });

    expect(result.grossProfit).toBe(1_950_000);
    expect(result.totalIndicativeCommission).toBe(38_610);
    expect(result.signaturePayment).toBe(19_305);
    expect(result.deferredPayment).toBe(19_305);
    expect(result.payableAtSignature).toBe(true);
  });

  it('calculates £15m at 15% gross margin and 100% sales credit', () => {
    const result = calculateCommission({
      contractValue: 15_000_000,
      grossMarginPercent: 15,
      salesCreditPercent: 100,
      approvalStatus: 'approved',
      conditionsStatus: 'cleared',
    });

    expect(result.grossProfit).toBe(2_250_000);
    expect(result.totalIndicativeCommission).toBe(55_125);
  });

  it('calculates £15m at 18% gross margin and 100% sales credit', () => {
    const result = calculateCommission({
      contractValue: 15_000_000,
      grossMarginPercent: 18,
      salesCreditPercent: 100,
      approvalStatus: 'approved',
      conditionsStatus: 'cleared',
    });

    expect(result.grossProfit).toBe(2_700_000);
    expect(result.totalIndicativeCommission).toBe(85_050);
  });

  it('applies 50% sales credit', () => {
    const result = calculateCommission({
      contractValue: 15_000_000,
      grossMarginPercent: 13,
      salesCreditPercent: 50,
      approvalStatus: 'approved',
      conditionsStatus: 'cleared',
    });

    expect(result.totalIndicativeCommission).toBe(19_305);
    expect(result.signaturePayment).toBe(9_652.5);
  });

  it('does not mark payment as payable if not approved', () => {
    const result = calculateCommission({
      contractValue: 15_000_000,
      grossMarginPercent: 13,
      salesCreditPercent: 100,
      approvalStatus: 'not_approved',
      conditionsStatus: 'cleared',
    });

    expect(result.payableAtSignature).toBe(false);
  });

  it('selects the correct band boundaries', () => {
    expect(findCommissionBand(13).rateOfGrossProfit).toBe(0.0198);
    expect(findCommissionBand(14.99).rateOfGrossProfit).toBe(0.0198);
    expect(findCommissionBand(15).rateOfGrossProfit).toBe(0.0245);
    expect(findCommissionBand(17.99).rateOfGrossProfit).toBe(0.0245);
    expect(findCommissionBand(18).rateOfGrossProfit).toBe(0.0315);
  });

  it('formats GBP values for UK users', () => {
    expect(formatGBP(38610)).toBe('£38,610');
  });
});
