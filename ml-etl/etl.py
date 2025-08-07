import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import os

# Create folders if missing
os.makedirs("data", exist_ok=True)
os.makedirs("model", exist_ok=True)

# Load raw data
df = pd.read_csv("data/salaries.csv")

# Drop rows where target (Salary) is missing
df = df.dropna(subset=["Salary"])

# Separate features and target
y = df["Salary"]
X = df.drop("Salary", axis=1)

# Fill numeric NaNs with 0
numeric_cols = X.select_dtypes(include=["number"]).columns
X[numeric_cols] = X[numeric_cols].fillna(0)

# Encode all object-type (non-numeric) columns
for col in X.columns:
    if X[col].dtype == "object":
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))

# Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Save processed data to CSV files
X_train.to_csv("data/X_train.csv", index=False)
X_test.to_csv("data/X_test.csv", index=False)
y_train.to_csv("data/y_train.csv", index=False)
y_test.to_csv("data/y_test.csv", index=False)

print("✅ ETL complete. Encoded & saved X_train, X_test, y_train, y_test.")
