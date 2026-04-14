from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app) 

# Load the exported models and scaler
try:
    lr_model = joblib.load('linear_model.pkl')
    rf_model = joblib.load('random_forest_model.pkl')
    scaler = joblib.load('scaler.pkl')
except Exception as e:
    print(f"Error loading models: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Expecting a JSON list of 19 values from the frontend
        data = request.json['features'] 
        
        # 1. Scale the input
        scaled_data = scaler.transform([data])
        
        # 2. Get raw predictions
        pred_lr = lr_model.predict(scaled_data)[0]
        pred_rf = rf_model.predict(scaled_data)[0]
        
        # 3. Ensemble logic (Mean of both)
        raw_final_score = (pred_lr + pred_rf) / 2
        
        # 4. FIX: Clamp the values between 0 and 100
        # This prevents scores like 105% (which would be 10.5 CGPA)
        final_score = np.clip(raw_final_score, 0, 100)
        
        return jsonify({
            'status': 'success',
            'prediction': round(float(final_score), 2),
            'individual_scores': {
                'linear': round(float(np.clip(pred_lr, 0, 100)), 2),
                'random_forest': round(float(np.clip(pred_rf, 0, 100)), 2)
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    # Running on port 5001
    app.run(host='0.0.0.0', port=5001, debug=True)