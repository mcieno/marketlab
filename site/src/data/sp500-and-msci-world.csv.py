import datetime
import sys

import pandas
import yfinance


data_sp500: pandas.DataFrame = yfinance.download("^GSPC", start="1900-01-01", end=datetime.datetime.now().strftime("%Y-%m-%d"), auto_adjust=True)
prices_sp500 = data_sp500["Close"].squeeze().rename("S&P 500")

data_msciworld: pandas.DataFrame = yfinance.download("^990100-USD-STRD", start="1900-01-01", end=datetime.datetime.now().strftime("%Y-%m-%d"), auto_adjust=True)
prices_msciworld = data_msciworld["Close"].squeeze().rename("MSCI World")

if len(prices_sp500) == 0 or len(prices_msciworld) == 0:
    raise ValueError("Failed to download price data")

prices: pandas.DataFrame = pandas.concat([prices_sp500, prices_msciworld], axis=1).dropna()
prices.to_csv(sys.stdout, date_format="%Y-%m-%d", float_format="%.3f")
