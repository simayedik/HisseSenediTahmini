from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import xgboost as xgb
import numpy as np
import pandas as pd
import os
from features import prepare_features  # Bu dosyada prepare_features fonksiyonu olacak

app = Flask(__name__)
CORS(app)

# Modelleri yükle
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
elastic = joblib.load(os.path.join(BASE_DIR, "models/multi_elastic_model.pkl"))
svr = joblib.load(os.path.join(BASE_DIR, "models/multi_svr_model.pkl"))
xgb_model = joblib.load(os.path.join(BASE_DIR, "models/multi_xgb_model.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "models/multi_stock_scaler.pkl"))
le = joblib.load(os.path.join(BASE_DIR, "models/ticker_encoder.pkl"))

# Kullanılan özellikler
feature_cols = [
    f"lag_{i}" for i in range(1, 6)
] + [
    "ma_3", "ma_7", "pct_change", "momentum_3", "momentum_7",
    "volatility_3", "volatility_7", "RSI_14", "MACD", "MACD_signal",
    "BB_upper", "BB_lower", "Momentum_10", "Volatility_20", "ticker_encoded"
]

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    ticker = data.get("ticker")

    if not ticker:
        return jsonify({"error": "Hisse kodu belirtilmedi"}), 400

    try:
        # Özellikleri hazırla
        df = prepare_features(ticker, le)
        # bData=df.head().to_json(orient='records')
        data = df[['Date','price']].to_json(orient='records')
        # dates = df['Date','price'].dt.strftime("%Y-%m-%d").tail(3).tolist()
        
        
        # df_input = df.tail(1)[feature_cols]

        # # Ölçeklendir
        # X_scaled = scaler.transform(df_input)
        # X_scaled = np.array(X_scaled)

        # # Tahminler
        # elastic_pred = elastic.predict(X_scaled)[0]
        # svr_pred = svr.predict(X_scaled)[0]
        # xgb_pred = xgb_model.predict(X_scaled)[0]
        
        df_input = df.tail(3)
        X_scaled = scaler.transform(df_input[feature_cols])

        # Tahminleri yap
        elastic_preds = elastic.predict(X_scaled)
        svr_preds = svr.predict(X_scaled)
        xgb_preds = xgb_model.predict(X_scaled)

      
        # true_prices = df_input["price"].tolist()


        result = []
        for i in range(3):
            result.append({
                "elastic_pred": float(elastic_preds[i]),
                "svr_pred": float(svr_preds[i]),
                "xgb_pred": float(xgb_preds[i])
            })
        return jsonify({
            "data":data,
            "ticker": ticker,
            "predictions": result
        })

    except Exception as e:
        print(f"Error: {e}")  # Hata mesajını konsola yazdır
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)


