import {
  COMMISSION_BANDS,
  CommissionBand,
  DEFERRED_PAYMENT_PERCENTAGE,
  SIGNATURE_PAYMENT_PERCENTAGE,
} from './commissionRules';

export type ApprovalStatus = 'approved' | 'not_approved';
export type ConditionsStatus = 'cleared' | 'not_cleared';

export type CommissionInput = {
  contractValue: number;
  grossMarginPercent: number;
  salesCreditPercent: number;
  approvalStatus: ApprovalStatus;
  conditionsStatus: ConditionsStatus;
};

export type CommissionResult = {
  contractValue: number;
  grossMarginPercent: number;
  salesCreditPercent: number;
  grossProfit: number;
  commissionBand: CommissionBand;
  totalIndicativeCommission: number;
  signaturePayment: number;
  deferredPayment: number;
  payableAtSignature: boolean;
  warnings: string[];
};

export function findCommissionBand(grossMarginPercent: number): CommissionBand {
  if (!Number.isFinite(grossMarginPercent) || grossMarginPercent < 0) {
    throw new Error('Gross margin percentage must be a positive number.');
  }

  const band = COMMISSION_BANDS.find((candidate) => {
    const aboveMinimum = grossMarginPercent >= candidate.minMarginPercent;
    const belowMaximum =
      candidate.maxMarginPercent === null || grossMarginPercent <= candidate.maxMarginPercent;
    return aboveMinimum && belowMaximum;
  });

  if (!band) {
    throw new Error('No commission band found for this gross margin percentage.');
  }

  return band;
}

export function calculateCommission(input: CommissionInput): CommissionResult {
  const { contractValue, grossMarginPercent, salesCreditPercent, approvalStatus, conditionsStatus } = input;

  if (!Number.isFinite(contractValue) || contractValue < 0) {
    throw new Error('Contract value must be a positive number.');
  }

  if (!Number.isFinite(salesCreditPercent) || salesCreditPercent < 0 || salesCreditPercent > 100) {
    throw new Error('Sales credit percentage must be between 0 and 100.');
  }

  const commissionBand = findCommissionBand(grossMarginPercent);
  const grossProfit = contractValue * (grossMarginPercent / 100);
  const totalIndicativeCommission =
    grossProfit * commissionBand.rateOfGrossProfit * (salesCreditPercent / 100);
  const signaturePayment = totalIndicativeCommission * SIGNATURE_PAYMENT_PERCENTAGE;
  const deferredPayment = totalIndicativeCommission * DEFERRED_PAYMENT_PERCENTAGE;

  const warnings: string[] = [];

  if (grossMarginPercent < 13) {
    warnings.push('No commission is payable below 13% gross margin.');
  }

  if (approvalStatus !== 'approved') {
    warnings.push('Indicative only - not payable until the deal has full internal approval.');
  }

  if (conditionsStatus !== 'cleared') {
    warnings.push('Indicative only - not payable at signature until all conditions precedent are cleared.');
  }

  warnings.push(
    'Indicative only - final commission is subject to Finance validation, approval gates, final margin reconciliation and the formal policy.'
  );

  return {
    contractValue,
    grossMarginPercent,
    salesCreditPercent,
    grossProfit,
    commissionBand,
    totalIndicativeCommission,
    signaturePayment,
    deferredPayment,
    payableAtSignature:
      totalIndicativeCommission > 0 && approvalStatus === 'approved' && conditionsStatus === 'cleared',
    warnings,
  };
}

export function formatGBP(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value);
}
