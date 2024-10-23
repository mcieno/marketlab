---
title: Fund switch
---

# Fund switch

This tool visualizes the tax implications of switching funds.

To exit a fund you tipically have to realize gains and pay capital gain taxes.
This operation effectively reduces the total amount of money available, slowing
down the compound interest.

## Configuration

```js
const exampleAmount = 1_000;
```

```js
const gain = view(
  Inputs.range([-99.99, +300], {
    width,
    value: 80,
    step: 0.01,
    label: "Carrent capital gain/loss (%)",
  }),
);
```

```js
const exampleGainOrLoss = (exampleAmount * gain) / 100;
```

A capital ${gain >= 0 ? "gain" : "loss"} of <strong>${d3.format("+.2\%")(gain / 100)}</strong>
means that if you invested ${d3.format(",.0f")(exampleAmount)}€ you'd now be
standing on ${d3.format(".2f")(exampleAmount + exampleGainOrLoss)}€, with an
unrealized ${gain >= 0 ? "gain" : "loss"} of ${d3.format("+.2f")(exampleGainOrLoss)}€.

```js
const cgt = view(
  Inputs.range([0, 100], {
    width,
    value: 26,
    step: 0.5,
    label: "Capital gain tax (%)",
  }),
);
```

```js
const exampleCapitalGainTax = (Math.max(0, exampleGainOrLoss) * cgt) / 100;
```

The taxable gains are <strong>${d3.format(".2\%")(Math.max(0, gain / 100))}</strong>
of the initial investment. Hence, to realize the ${gain >= 0 ? "gain" : "loss"}
of ${d3.format("+,.2f")(exampleGainOrLoss)}€ on an initial investment of
${d3.format(",.0f")(exampleAmount)}€ you'll have to pay
<strong>${d3.format(",.2f")(exampleCapitalGainTax)}€</strong> of capital gain tax.

### Current and desired funds

Use the following fields to configure the parameters of the current and desired
funds.

<div class="tip">
  <p>Subtract ongoing charges to the the annual return.</p>
  <p>
    For example, suppose one of the funds is
    <a href="https://www.justetf.com/en/etf-profile.html?isin=IE00BK5BQT80">VWCE</a>.
  <p>
    Its benchmark, FTSE All-World, had a compound annual growth rate of
    <abbr title="8.66% in USD — Source: curvo.eu — Period: September 2003 to June 2024">8.66%</abbr>.
    Meanwhile the ongoing charges of the fund are <abbr title="Source: 2024 Key Information Document (KID)">0.24%</abbr>:
    <ul>
      <li>Management fees: 22&permil;</li>
      <li>Transaction fees: 2&permil;</li>
    </ul>
  </p>
  <p>Hence, you should input <strong><abbr title="8.66% - 0.24%">8.42%</abbr></strong>.</p>
</div>

#### Current fund

```js
const current = view(
  Inputs.form({
    agr: Inputs.range([0.01, 20], {
      width,
      value: 8.5,
      step: 0.01,
      label: "Annual gross return incl. charges (%)",
    }),
    fee: Inputs.range([0, 5], {
      width,
      value: 2.5,
      step: 0.001,
      label: "Exit fee (%)",
    }),
  }),
);
```

#### Desired fund

```js
const desired = view(
  Inputs.form({
    agr: Inputs.range([0.01, 20], {
      width,
      value: 9,
      step: 0.01,
      label: "Annual gross return incl. charges (%)",
    }),
    fee: Inputs.range([0, 5], {
      width,
      value: 0.2,
      step: 0.01,
      label: "Purchase fee (%)",
    }),
    exit: Inputs.range([0, 5], {
      width,
      value: 0.2,
      step: 0.01,
      label: "Exit fee (%)",
    }),
  }),
);
```

## Future capital without switching

Suppose you originally invested ${tex`\mathcal{M}`} money.

If you remain in the current fund, after ${tex`\Delta`} days the gross and net
(before exit fees) capitals would be:

```tex
\text{Gross} = \mathcal{M}
  \cdot ${d3.format(".4f")(1 + gain / 100)}
    \cdot \left( 1 ${d3.format("+.2f")(current.agr)}\% \right)^{\frac{\Delta}{365}}
```

```tex
\text{Net} = \text{Gross}
  - ${d3.format(".2f")(cgt)}\% \cdot \max{\left(0, \text{Gross} - \mathcal{M} \right)}
```

## Future capital if switching

```js
const remainingAfterExit =
  (1 - (Math.max(0, gain / 100) * cgt) / 100 / (1 + gain / 100)) *
  (1 - current.fee / 100);
```

Due to capital gain taxes and exit fees, upon realizing the current fund
${gain >= 0 ? "gains" : "losses"}, your liquidity will be
<strong>${d3.format(".3\%")(remainingAfterExit)}</strong> of the gross.

```js
const remainingAfterPurchase = remainingAfterExit * (1 - desired.fee / 100);
```

To then invest in the desired fund you'll have to pay
**${d3.format(".2\%")(desired.fee / 100)}** in purchase fees, meaning that
you'll be entering the fund with **${d3.format(".3\%")(remainingAfterPurchase)}**
of the current gross capital; _i.e._

```tex
\mathcal{M} \cdot ${d3.format(".4f")(remainingAfterPurchase * (1 + gain / 100))}
```

Though you might be entering the desired fund with less capital, you'll later
pay fewer capital gain taxes.

Hence, after ${tex`\Delta`} days the gross and net (before exit fees) capitals
in the desired fund would be:

```tex
\text{Gross} = \mathcal{M}
  \cdot ${d3.format(".4f")(remainingAfterPurchase * (1 + gain / 100))}
    \cdot \left( 1 ${d3.format("+.2f")(desired.agr)}\% \right)^{\frac{\Delta}{365}}
```

```tex
\text{Net} =
  \text{Gross}
    - ${d3.format(".2f")(cgt)}\% \cdot \max{\left(
      0,
      \text{Gross} - \mathcal{M} \cdot ${d3.format(".4f")(remainingAfterPurchase * (1 + gain / 100))}
    \right)}
```

## Break-even

```js
const currentGross = d =>
  (1 + gain / 100) * Math.pow(1 + current.agr / 100, d / 365);
const desiredGross = d =>
  remainingAfterPurchase *
  (1 + gain / 100) *
  Math.pow(1 + desired.agr / 100, d / 365);
const currentNet = d =>
  currentGross(d) - (cgt / 100) * Math.max(0, currentGross(d) - 1);
const desiredNet = d =>
  desiredGross(d) -
  (cgt / 100) *
    Math.max(0, desiredGross(d) - remainingAfterPurchase * (1 + gain / 100));
const currentNetAfterExitFees = d =>
  Math.round(1e8 * currentNet(d) * (1 - current.fee / 100)) / 1e8;
const desiredNetAfterExitFees = d =>
  Math.round(1e8 * desiredNet(d) * (1 - desired.exit / 100)) / 1e8;
```

```js
function findBreakeven(l, h, fl, fh, delta = 1e-6) {
  if (fl(l) >= fh(l)) {
    return { found: false, best: l };
  }
  if (fl(h) <= fh(h)) {
    return { found: false, best: h };
  }

  while (h - l > delta) {
    const c = (l + h) / 2;
    if (fl(c) - fh(c) < 0) {
      l = c;
    } else {
      h = c;
    }
  }

  return { found: true, best: (l + h) / 2 };
}
```

```js
const maxSearch = 100 * 365;
const { found, best } = findBreakeven(
  0,
  maxSearch,
  desiredNetAfterExitFees,
  currentNetAfterExitFees,
);
```

${
  found
    ? html`It would take <strong>&thickapprox;${(best / 365).toFixed(1)} years</strong> to break even.`
    : current.agr === desired.agr
      ? gain * cgt <= 0 && current.fee === 0 && desired.fee === 0 && desired.exit === 0
        ? html`The funds perform identically and switching would not incur in any taxes/fees. It would make <strong>no difference</strong>.`
        : html`The funds perform identically, but switching would incur in taxes/fees. You will <strong>never</strong> break even and forever be <strong>worse</strong>.`
      : current.agr > desired.agr
        ? html`The desired fund performs worse than the current one. You will <strong>never</strong> break even and forever be <strong>worse</strong>.`
        : best > 0
          ? html`You will break-even one day... but you won't be alive...`
          : html`You will <strong>immediately</strong> break even and forever be <strong>better</strong>`
}

```js
const size = 1_000;
const step = (found ? Math.min(best * 2, maxSearch) : maxSearch) / size;

const today = new Date();
const breakeven = found ? new Date(today.getTime() + best * 86_400_000) : null;
const prices = Array.from(new Array(size)).flatMap((_, i) => [
  {
    Date: new Date(today.getTime() + i * step * 86_400_000),
    Price: currentNetAfterExitFees(i * step),
    Fund: "Current",
  },
  {
    Date: new Date(today.getTime() + i * step * 86_400_000),
    Price: desiredNetAfterExitFees(i * step),
    Fund: "Desired",
  },
]);
```

```js
function chartBreakeven(prices, breakeven, { width, scale }) {
  return Plot.plot({
    width,
    title: "Future net capital and break-even",
    x: { label: "Date" },
    y: { label: "Net capital (after exit fees)", type: scale, grid: true },
    color: { legend: true },
    marks: [
      Plot.line(prices, {
        x: "Date",
        y: "Price",
        z: "Fund",
        stroke: "Fund",
        interval: "day",
        tip: {
          format: {
            x: d3.utcFormat("%Y-%m-%d"),
            y: d3.format(".2f"),
          },
        },
      }),
      breakeven
        ? Plot.ruleX([breakeven], {
            tip: {
              format: {
                x: d3.utcFormat("%Y-%m-%d"),
              },
            },
          })
        : null,
    ],
  });
}
```

<div class="grid grid-cols-1">
  <div class="card">

```js
const scale = view(
  Inputs.select(["log", "linear"], { value: "log", label: "Y-axis scale" }),
);
```

${resize((width) => chartBreakeven(prices, breakeven, { width, scale }))}

  </div>
</div>

```js
prices;
```
