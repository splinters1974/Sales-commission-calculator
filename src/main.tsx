import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { calculateCommission, formatGBP } from './commissionCalculator';
import './styles.css';

function App() {
  const [contractValue, setContractValue] = useState(15_000_000);
  const [grossMarginPercent, setGrossMarginPercent] = useState(13);
  const [salesCreditPercent, setSalesCreditPercent] = useState(100);
  const [approvalStatus, setApprovalStatus] = useState<'approved' | 'not_approved'>('approved');
  const [conditionsStatus, setConditionsStatus] = useState<'cleared' | 'not_cleared'>('cleared');

  const result = useMemo(
    () =>
      calculateCommission({
        contractValue,
        grossMarginPercent,
        salesCreditPercent,
        approvalStatus,
        conditionsStatus,
      }),
    [contractValue, grossMarginPercent, salesCreditPercent, approvalStatus, conditionsStatus]
  );

  return (
    <main className="page">
      <section className="card">
        <div className="header">
          <p className="eyebrow">Internal tool - draft</p>
          <h1>Sales Commission Calculator</h1>
          <p>
            Estimate indicative commission based on contract value, approved gross margin and sales credit.
          </p>
        </div>

        <div className="grid">
          <form className="inputs">
            <label>
              Contract value (£)
              <input
                type="number"
                min="0"
                step="1000"
                value={contractValue}
                onChange={(event) => setContractValue(Number(event.target.value))}
              />
            </label>

            <label>
              Approved gross margin (%)
              <input
                type="number"
                min="0"
                step="0.1"
                value={grossMarginPercent}
                onChange={(event) => setGrossMarginPercent(Number(event.target.value))}
              />
            </label>

            <label>
              Sales credit (%)
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={salesCreditPercent}
                onChange={(event) => setSalesCreditPercent(Number(event.target.value))}
              />
            </label>

            <label>
              Approval status
              <select
                value={approvalStatus}
                onChange={(event) => setApprovalStatus(event.target.value as 'approved' | 'not_approved')}
              >
                <option value="approved">Approved</option>
                <option value="not_approved">Not approved</option>
              </select>
            </label>

            <label>
              Conditions precedent
              <select
                value={conditionsStatus}
                onChange={(event) => setConditionsStatus(event.target.value as 'cleared' | 'not_cleared')}
              >
                <option value="cleared">Cleared</option>
                <option value="not_cleared">Not cleared</option>
              </select>
            </label>
          </form>

          <section className="results" aria-live="polite">
            <h2>Indicative result</h2>
            <dl>
              <div>
                <dt>Gross profit</dt>
                <dd>{formatGBP(result.grossProfit)}</dd>
              </div>
              <div>
                <dt>Commission band</dt>
                <dd>{result.commissionBand.label}</dd>
              </div>
              <div>
                <dt>Total commission</dt>
                <dd>{formatGBP(result.totalIndicativeCommission)}</dd>
              </div>
              <div>
                <dt>50% signature payment</dt>
                <dd>{formatGBP(result.signaturePayment)}</dd>
              </div>
              <div>
                <dt>50% deferred payment</dt>
                <dd>{formatGBP(result.deferredPayment)}</dd>
              </div>
              <div>
                <dt>Payable at signature?</dt>
                <dd>{result.payableAtSignature ? 'Yes - subject to policy' : 'No / not yet'}</dd>
              </div>
            </dl>

            <div className="warnings">
              {result.warnings.map((warning) => (
                <p key={warning}>{warning}</p>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
