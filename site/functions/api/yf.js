const YAHOO_FINANCE_API_ENDPOINT =
  "https://query2.finance.yahoo.com/v8/finance/chart";

export async function onRequest(context) {
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  }

  const ticker = new URL(context.request.url).searchParams.get("ticker");
  if (!ticker) {
    return new Response(null, {
      status: 422,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const result = await fetch(
    YAHOO_FINANCE_API_ENDPOINT +
      "/" +
      encodeURIComponent(ticker) +
      "?" +
      new URLSearchParams({ range: "99y", interval: "1d" }).toString(),
    context.request,
  );
  const body =
    context.request.method === "HEAD"
      ? null
      : JSON.stringify(await result.json());
  return new Response(body, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Expose-Headers": "Date",
      "Cache-Control": "public, max-age=604800, immutable",
      "Content-Type": "application/json",
    },
  });
}
