export type CommissionBand = {
  label: string;
  minMarginPercent: number;
  maxMarginPercent: number | null;
  rateOfGrossProfit: number;
};

export const COMMISSION_BANDS: CommissionBand[] = [
  {
    label: 'Below 13% GM - no commission',
    minMarginPercent: 0,
    maxMarginPercent: 12.999999,
    rateOfGrossProfit: 0,
  },
  {
    label: '13% to 14.99% GM - base',
    minMarginPercent: 13,
    maxMarginPercent: 14.999999,
    rateOfGrossProfit: 0.0198,
  },
  {
    label: '15% to 17.99% GM - stretch',
    minMarginPercent: 15,
    maxMarginPercent: 17.999999,
    rateOfGrossProfit: 0.0245,
  },
  {
    label: '18%+ GM - high stretch',
    minMarginPercent: 18,
    maxMarginPercent: null,
    rateOfGrossProfit: 0.0315,
  },
];

export const SIGNATURE_PAYMENT_PERCENTAGE = 0.5;
export const DEFERRED_PAYMENT_PERCENTAGE = 0.5;
