import yfinance as yf
import pandas as pd
from sklearn.preprocessing import LabelEncoder

# Hisse senedi kodları
# tickers = [
#     "SISE.IS", "GARAN.IS", "ASELS.IS", "THYAO.IS",
#     "TTRAK.IS", "YKBNK.IS", "AYDEM.IS", "ISDMR.IS", "TSKB.IS"
# ]

# # Verileri çekme
# data = yf.download(tickers, period="1y", interval="1d")
# close_prices = data["Close"].dropna()

# RSI, MACD, Bollinger Bands, Momentum ve Volatilite hesaplama fonksiyonları
def compute_rsi(data, window=14):
    delta = data.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

def compute_macd(data, slow=26, fast=12, signal=9):
    exp1 = data.ewm(span=fast, adjust=False).mean()
    exp2 = data.ewm(span=slow, adjust=False).mean()
    macd = exp1 - exp2
    signal_line = macd.ewm(span=signal, adjust=False).mean()
    return macd, signal_line

def compute_bollinger_bands(data, window=20):
    sma = data.rolling(window=window).mean()
    std = data.rolling(window=window).std()
    upper_band = sma + (std * 2)
    lower_band = sma - (std * 2)
    return upper_band, lower_band

def compute_momentum(data, window=10):
    return data - data.shift(window)

def compute_volatility(data, window=20):
    return data.rolling(window=window).std()

# LabelEncoder'ı tanımlayın
le = LabelEncoder()

def prepare_features(ticker, le):
    
    data = yf.download(ticker, period="1y", interval="1d")["Close"].dropna()
    df = pd.DataFrame(data)
    df.columns = ["price"]

    df = df.reset_index()  # Burada tarih "Date" sütunu olur

    df["target"] = df["price"].shift(-1)
    for i in range(1, 6):
        df[f"lag_{i}"] = df["price"].shift(i)

    df["ma_3"] = df["price"].rolling(3).mean()
    df["ma_7"] = df["price"].rolling(7).mean()
    df["pct_change"] = df["price"].pct_change()
    df["momentum_3"] = df["price"] - df["price"].shift(3)
    df["momentum_7"] = df["price"] - df["price"].shift(7)
    df["volatility_3"] = df["price"].rolling(3).std()
    df["volatility_7"] = df["price"].rolling(7).std()
    df["RSI_14"] = compute_rsi(df["price"])
    df["MACD"], df["MACD_signal"] = compute_macd(df["price"])
    df["BB_upper"], df["BB_lower"] = compute_bollinger_bands(df["price"])
    df["Momentum_10"] = compute_momentum(df["price"])
    df["Volatility_20"] = compute_volatility(df["price"])

    # Ticker'ı encode et
    df["ticker_encoded"] = le.transform([ticker])[0]
 
    df = df.dropna().reset_index(drop=True)


    return df






