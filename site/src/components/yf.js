import * as d3 from "npm:d3";

const CACHE_EXPIRES_AFTER = 86_400_000 * 7;
const CACHE_NAME = "mktchf-yf";

/**
 * @param {string} ticker
 * @returns {Promise<Record<string, any> | null>}
 */
async function fetchTickerDataFromYahooFinance(ticker) {
  const cache = await caches.open(CACHE_NAME);

  // Custom endpoint because CORS
  const endpoint =
    "/api/yf?" +
    new URLSearchParams({ ticker: ticker.toUpperCase() }).toString();

  let response = await cache.match(endpoint);
  const expiry =
    new Date(response?.headers.get("date") || 0).getTime() +
    CACHE_EXPIRES_AFTER;
  if (new Date() > expiry) {
    try {
      response = await fetch(endpoint);
    } catch (error) {
      if (!response) {
        throw error;
      }
      // It's better to serve outdated data then than throwing an error.
      console.error(error);
    }
  }

  const data = await response.clone().json(); // Clone to make it cacheable

  if (data.chart.error !== null) {
    return null;
  }

  if (data.chart.result?.length !== 1) {
    return null;
  }

  if (!(data.chart.result[0].timestamp instanceof Array)) {
    return null;
  }

  if (data.chart.result[0].timestamp.length === 0) {
    return null;
  }

  await cache.put(endpoint, response);

  return data;
}

/**
 * Downloads historical prices for the given ticker from Yahoo Finance.
 *
 * @param {string} ticker
 * @returns {Promise<(Record<string, number> & { Date: Date })[]>}
 */
export async function download(tickers) {
  /** @type {Map<string, Record<string, number>>} */
  const dataset = new Map();
  /** @type {Set<string>} */
  const symbols = new Set();

  for (const ticker of tickers) {
    const data = await fetchTickerDataFromYahooFinance(ticker);
    if (data === null) {
      continue;
    }

    const symbol = data.chart.result[0].meta.symbol;
    if (!symbol || symbol === "Date") {
      continue;
    }

    data.chart.result[0].timestamp.forEach((t, k) => {
      const strDate = d3.utcFormat("%Y-%m-%d")(t * 1_000);
      const values = dataset.get(strDate) || {};
      values[symbol] = data.chart.result[0].indicators.adjclose[0].adjclose[k];
      dataset.set(strDate, values);
    });
    symbols.add(symbol);
  }

  /** @type {(Record<string, number> & { Date: Date })[]} */
  const csv = Array.from(dataset.entries())
    .filter(
      ([_, values]) =>
        // All assets must have a price defined on this date
        Array.from(symbols).every(s => !isNaN(parseFloat(values[s]))) &&
        // There must be no missing symbols
        Object.keys(values).every(s => symbols.has(s)),
    )
    .map(([strDate, values]) => ({
      Date: new Date(strDate),
      ...values,
    }));

  csv.__proto__.columns = ["Date", ...symbols];
  return csv;
}
