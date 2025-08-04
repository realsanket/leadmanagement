import pandas as pd
from flask import Flask, request, jsonify
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import shap
import joblib
import os

# Load and clean data
DATA_PATH = os.path.join(os.path.dirname(__file__), '../small file.csv')
df = pd.read_csv(DATA_PATH)
X = df.drop(['Converted', 'Name', 'Email', 'Website'], axis=1)
X = pd.get_dummies(X)
y = df['Converted']

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)
joblib.dump(model, 'lead_model.pkl')

# SHAP explainer
explainer = shap.TreeExplainer(model)

from chat_api import chat_api
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains
app.register_blueprint(chat_api)

@app.route('/score', methods=['POST'])
def score():
    data = request.json
    input_df = pd.DataFrame([data])
    input_df = pd.get_dummies(input_df)
    input_df = input_df.reindex(columns=X.columns, fill_value=0)
    score = model.predict_proba(input_df)[0][1]
    shap_values = explainer.shap_values(input_df)[1][0]
    feature_importance = sorted(zip(X.columns, shap_values), key=lambda x: abs(x[1]), reverse=True)
    explanation = [{"feature": f, "impact": float(imp)} for f, imp in feature_importance[:5]]
    return jsonify({"score": float(score), "explanation": explanation})

@app.route('/feedback', methods=['POST'])
def feedback():
    feedback = request.json
    pd.DataFrame([feedback]).to_csv('feedback.csv', mode='a', header=not os.path.exists('feedback.csv'), index=False)
    return jsonify({"status": "received"})

if __name__ == '__main__':
    app.run(port=5000)
