import pandas as pd
import pickle
import os
from sklearn.linear_model import LinearRegression

# Get current directory
current_dir = os.path.dirname(__file__)

# Load dataset from uploads/
file_path = os.path.join(current_dir, "uploads", "dataset.csv")
df = pd.read_csv(file_path)

# 🧹 Preprocess
X = df[["YearsCodePro", "WorkExp", "NumberOfDatabasesKnown", "NumberOfPlatformsKnown"]]
X = pd.get_dummies(pd.concat([X, df["OrgSize"]], axis=1), drop_first=True)
y = df["Salary"]

# Train model
model = LinearRegression()
model.fit(X, y)

# ✅ Ensure model directory exists
model_dir = os.path.join(current_dir, "model")
os.makedirs(model_dir, exist_ok=True)

# Save model
model_path = os.path.join(model_dir, "salary_predictor.pkl")
with open(model_path, "wb") as f:
    pickle.dump(model, f)

print(" Model retrained and saved.")
