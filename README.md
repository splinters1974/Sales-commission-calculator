# Sales Commission Calculator

Internal draft calculator for estimating indicative sales commission based on contract value, approved gross margin and sales credit.

## Current draft assumptions

| Approved gross margin | Commission rate |
| --- | ---: |
| Below 13% | 0% |
| 13% to 14.99% | 1.98% of gross profit |
| 15% to 17.99% | 2.45% of gross profit |
| 18%+ | 3.15% of gross profit |

Commission is split 50% at approved contract signature and 50% after final project gross margin reconciliation.

These assumptions are draft and must be validated by Finance and leadership before this tool is used as policy.

## For sales people (no install needed)

Use the hosted calculator: **https://splinters1974.github.io/Sales-commission-calculator/**

Or open [`index.html`](index.html) directly in any web browser — double-click the file, or host it on an internal page. It is a single, self-contained file with no build step, install or internet connection required, and produces the same results as the developer app below. (`standalone.html` is kept as a redirect to it so older links keep working.)

## Running locally (developers)

The React/TypeScript version is entered from `app.html`:

```bash
npm install
npm run dev
```

## Testing

```bash
npm test
```

## Build

```bash
npm run build
```

## Governance note

All commission rules are stored in `src/commissionRules.ts` (and mirrored in `index.html`). Any change to thresholds, rates or payment split should be made in both places through a pull request and approved by the relevant business owner and Finance.

## Disclaimer

This calculator is indicative only. Final commission remains subject to the formal commission policy, Finance validation, approval gates, conditions precedent, final margin reconciliation and any applicable leaver or clawback rules.
