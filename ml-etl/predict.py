import os
import sys
import json
import pickle
import pandas as pd

# Load pipeline
base_dir = os.path.dirname(__file__)
model_path = os.path.join(base_dir, "model", "salary_pipeline.pkl")

with open(model_path, "rb") as f:
    pipeline = pickle.load(f)

# Read input
input_data = json.loads(sys.stdin.read())
df = pd.DataFrame([input_data])

# Add any missing columns with default values (e.g., 0 or "")
num_cols = pipeline.named_steps["preprocessor"].transformers_[0][2]
cat_cols = pipeline.named_steps["preprocessor"].transformers_[1][2]
expected_cols = num_cols + cat_cols

for col in expected_cols:
    if col not in df.columns:
        df[col] = 0 if col in num_cols else ""

# Reorder columns to match training
df = df[expected_cols]

# Predict
predicted = pipeline.predict(df)[0]

# Output
print(json.dumps({
    "success": True,
    "predictedSalary": round(predicted, 2),
    "currency": "USD"
}))
