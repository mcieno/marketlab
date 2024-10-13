import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

/**
 * Converts CSV data into a dataset of daily prices.
 *
 * For example:
 *
 * ```csv
 * Date,Asset1,Asset2
 * 1970-01-01,100,200
 * ```
 *
 * will become:
 *
 * ```js
 * [
 *   { Date: new Date("1970-01-01"), Symbol: "Asset1", Price: 100 },
 *   { Date: new Date("1970-01-01"), Symbol: "Asset2", Price: 200 },
 * ]
 * ```
 *
 * Furthermore, rows are resampled so that there is one entry per day.
 *
 * @returns {{size: number, prices: {Date: Date; Price: number; Symbol: string}[]}}
 */
export function csv2dailyPrices(data) {
  const truncateDate = date => {
    return new Date(d3.utcFormat("%Y-%m-%d")(date));
  };

  if (data.length === 0) {
    return { prices: [], size: 0 };
  }

  if (!data.columns.includes("Date")) {
    throw new Error("Missing Date column");
  }

  const sorted = data
    .filter(({ Date }) => !!Date)
    .toSorted((a, b) => a.Date - b.Date);

  const iTime = truncateDate(sorted[0].Date).getTime();
  const fTime = truncateDate(sorted[sorted.length - 1].Date).getTime();

  const resampled = new Array((fTime - iTime) / 86_400_000 + 1);

  resampled[0] = {
    ...sorted[0],
    Date: new Date(iTime),
  };

  let j = 0;
  for (let i = 1; i < resampled.length; i++) {
    const t = iTime + i * 86_400_000;
    while (j < sorted.length - 1 && sorted[j].Date.getTime() < t) {
      j++;
    }
    resampled[i] = {
      ...sorted[j],
      Date: new Date(t),
    };
  }

  const symbols = data.columns.filter(c => c !== "Date");
  const prices = resampled.flatMap(row =>
    symbols.map(s => ({
      Date: row.Date,
      Price: row[s],
      Symbol: s,
    })),
  );

  return { prices, size: resampled.length };
}

/**
 * @param {{Date: Date; Price: number; Symbol: string}[]} prices
 * @param {{width: number; normalize: boolean}} options
 * @returns {Plot.plot}
 */
export function chartHistory(prices, { width, normalize }) {
  const transform = normalize ? Plot.normalizeY : i => i;
  const yaxis = normalize
    ? {
        label: "Change in price (%)",
        transform: y => (y - 1) * 100,
        percent: true,
        tickFormat: d3.format("+d"),
      }
    : {};
  return Plot.plot({
    width,
    title: "Historical prices",
    x: { label: "Date" },
    y: yaxis,
    color: { legend: true },
    marks: [
      Plot.ruleY([0]),
      Plot.lineY(
        prices,
        transform({
          x: "Date",
          y: "Price",
          z: "Symbol",
          stroke: "Symbol",
          interval: "day",
          tip: {
            format: {
              x: d3.utcFormat("%Y-%m-%d"),
            },
          },
        }),
      ),
    ],
  });
}
