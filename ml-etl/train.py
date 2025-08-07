# ml-etl/train.py
import os
import pickle
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

# Load dataset
base_dir = os.path.dirname(__file__)
df = pd.read_csv(os.path.join(base_dir, "uploads", "dataset.csv"))

X = df.drop("Salary", axis=1)
y = df["Salary"]

# Detect numeric and categorical columns
numeric = X.select_dtypes(include=["int64", "float64"]).columns.tolist()
categorical = X.select_dtypes(include=["object"]).columns.tolist()

# Preprocessing and pipeline
preprocessor = ColumnTransformer([
    ("num", "passthrough", numeric),
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical)
])

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("regressor", LinearRegression())
])

pipeline.fit(X, y)

# Save the pipeline
model_dir = os.path.join(base_dir, "model")
os.makedirs(model_dir, exist_ok=True)
model_path = os.path.join(model_dir, "salary_pipeline.pkl")

with open(model_path, "wb") as f:
    pickle.dump(pipeline, f)

print("✅ Model trained and saved.")
