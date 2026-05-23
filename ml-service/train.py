"""
Salary-Sense — Model Pool Training Script
Trains a diverse pool of regressors and saves the best model + metadata.
"""
import os
import json
import warnings
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
from sklearn.ensemble import (
    RandomForestRegressor, GradientBoostingRegressor,
    ExtraTreesRegressor, StackingRegressor
)
from sklearn.neighbors import KNeighborsRegressor
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor
from sklearn.metrics import (
    mean_squared_error, mean_absolute_error, r2_score
)

warnings.filterwarnings("ignore")

BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, "data", "dataset.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

FEATURES_PATH = os.path.join(MODEL_DIR, "features.json")
POOL_META_PATH = os.path.join(MODEL_DIR, "model_pool_meta.json")
BEST_MODEL_PATH = os.path.join(MODEL_DIR, "best_model.joblib")
ALL_MODELS_PATH = os.path.join(MODEL_DIR, "all_models.joblib")


def smape(y_true, y_pred):
    return 100 * np.mean(
        2 * np.abs(y_pred - y_true) / (np.abs(y_true) + np.abs(y_pred) + 1e-9)
    )


def mape(y_true, y_pred):
    return 100 * np.mean(np.abs((y_true - y_pred) / (y_true + 1e-9)))


def evaluate(y_true, y_pred):
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    mae = mean_absolute_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)
    return {
        "rmse": round(float(rmse), 2),
        "mae": round(float(mae), 2),
        "mape": round(float(mape(y_true, y_pred)), 2),
        "smape": round(float(smape(y_true, y_pred)), 2),
        "r2": round(float(r2), 4),
    }


def load_and_prepare():
    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=["Salary"])
    df = df[df["Salary"] > 0]

    # Remove extreme outliers (>= 99th percentile)
    q99 = df["Salary"].quantile(0.99)
    df = df[df["Salary"] <= q99]

    # Log-transform salary (as per research paper)
    df["log_salary"] = np.log1p(df["Salary"])

    # --- Numeric features ---
    num_cols = ["YearsCodePro", "WorkExp",
                "NumberOfDatabasesKnown", "NumberOfPlatformsKnown",
                "NumberOfWebFrameworksKnown"]

    # Boolean columns → int
    bool_cols = [
        "Freelancer", "Full-time", "Part-time",
        "Hybrid", "In-person", "Remote",
        "Associate", "Bachelors", "College", "Doctorate", "Masters",
        "DataTech", "Database", "Designer", "Developer", "Education",
        "Management", "Research", "Security", "SysAdmin",
        "Africa", "Asia", "Europe", "North America", "Oceania", "South America",
        "Finance", "Healthcare", "IT & Software", "Manufacturing & Supply"
    ]

    # Categorical feature
    cat_cols = ["OrgSize"]

    # Ensure numeric
    for col in num_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    # Boolean → int
    for col in bool_cols:
        if col in df.columns:
            df[col] = df[col].map({"True": 1, "False": 0, True: 1, False: 0}).fillna(0).astype(int)

    # Filter to existing columns
    num_cols = [c for c in num_cols if c in df.columns]
    bool_cols = [c for c in bool_cols if c in df.columns]
    cat_cols = [c for c in cat_cols if c in df.columns]

    all_features = num_cols + bool_cols + cat_cols

    X = df[all_features].copy()
    y = df["log_salary"].values  # train in log space

    feature_meta = {
        "numeric": num_cols,
        "boolean": bool_cols,
        "categorical": cat_cols,
        "all_features": all_features,
    }
    with open(FEATURES_PATH, "w") as f:
        json.dump(feature_meta, f, indent=2)

    print(f"✅ Dataset: {len(df)} rows | Features: {len(all_features)}")
    return X, y, all_features, num_cols, cat_cols, bool_cols


def build_preprocessor(num_cols, cat_cols, bool_cols):
    transformers = []
    if num_cols:
        transformers.append(("num", StandardScaler(), num_cols))
    if bool_cols:
        transformers.append(("bool", "passthrough", bool_cols))
    if cat_cols:
        transformers.append(("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), cat_cols))
    return ColumnTransformer(transformers=transformers, remainder="drop")


def train():
    print("🚀 Starting Salary-Sense Model Pool Training...")
    X, y, all_features, num_cols, cat_cols, bool_cols = load_and_prepare()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.15, random_state=42
    )
    X_train, X_val, y_train, y_val = train_test_split(
        X_train, y_train, test_size=0.1765, random_state=42  # ~15% of total
    )

    print(f"   Train: {len(X_train)} | Val: {len(X_val)} | Test: {len(X_test)}")

    preprocessor = build_preprocessor(num_cols, cat_cols, bool_cols)

    # ── Model Pool ──
    candidate_models = {
        "LinearRegression": LinearRegression(),
        "Ridge": Ridge(alpha=1.0),
        "Lasso": Lasso(alpha=0.1),
        "ElasticNet": ElasticNet(alpha=0.1, l1_ratio=0.5),
        "RandomForest": RandomForestRegressor(n_estimators=300, max_depth=None, random_state=42, n_jobs=-1),
        "ExtraTrees": ExtraTreesRegressor(n_estimators=200, random_state=42, n_jobs=-1),
        "GradientBoosting": GradientBoostingRegressor(n_estimators=300, learning_rate=0.1, max_depth=6, random_state=42),
        "XGBoost": XGBRegressor(n_estimators=300, learning_rate=0.1, max_depth=6, random_state=42, verbosity=0, n_jobs=-1),
        "LightGBM": LGBMRegressor(n_estimators=300, learning_rate=0.1, max_depth=6, random_state=42, n_jobs=-1, verbose=-1),
        "KNN": KNeighborsRegressor(n_neighbors=7, n_jobs=-1),
    }

    pool_results = []
    trained_pipelines = {}
    best_model_name = None
    best_rmse = float("inf")

    print("\n📊 Model Pool Evaluation:")
    print(f"{'Model':<22} {'R²':>7} {'RMSE':>12} {'MAE':>12} {'MAPE':>8}")
    print("-" * 65)

    for name, model in candidate_models.items():
        try:
            pipeline = Pipeline([
                ("preprocessor", preprocessor),
                (name, model)
            ])
            pipeline.fit(X_train, y_train)

            # Evaluate on validation set
            y_val_pred_log = pipeline.predict(X_val)
            # Back-transform from log space
            y_val_pred = np.expm1(y_val_pred_log)
            y_val_true = np.expm1(y_val)

            metrics = evaluate(y_val_true, y_val_pred)
            pool_results.append({"model": name, **metrics})
            trained_pipelines[name] = pipeline

            print(f"{name:<22} {metrics['r2']:>7.4f} {metrics['rmse']:>12,.0f} "
                  f"{metrics['mae']:>12,.0f} {metrics['mape']:>7.1f}%")

            if metrics["rmse"] < best_rmse:
                best_rmse = metrics["rmse"]
                best_model_name = name

        except Exception as e:
            print(f"⚠️  {name} failed: {e}")

    # ── Stacking Ensemble ──
    try:
        base_estimators = [
            ("rf", RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)),
            ("gb", GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)),
            ("xgb", XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42, verbosity=0)),
        ]
        stacker = StackingRegressor(
            estimators=base_estimators,
            final_estimator=Ridge(alpha=1.0),
            cv=3, n_jobs=-1
        )
        stacking_pipeline = Pipeline([
            ("preprocessor", preprocessor),
            ("stacker", stacker)
        ])
        stacking_pipeline.fit(X_train, y_train)
        y_val_pred_log = stacking_pipeline.predict(X_val)
        y_val_pred = np.expm1(y_val_pred_log)
        y_val_true = np.expm1(y_val)

        metrics = evaluate(y_val_true, y_val_pred)
        pool_results.append({"model": "Stacking", **metrics})
        trained_pipelines["Stacking"] = stacking_pipeline

        print(f"{'Stacking':<22} {metrics['r2']:>7.4f} {metrics['rmse']:>12,.0f} "
              f"{metrics['mae']:>12,.0f} {metrics['mape']:>7.1f}%")

        if metrics["rmse"] < best_rmse:
            best_rmse = metrics["rmse"]
            best_model_name = "Stacking"

    except Exception as e:
        print(f"⚠️  Stacking failed: {e}")

    print("-" * 65)
    print(f"\n🏆 Best Model: {best_model_name} (Val RMSE: ${best_rmse:,.0f})")

    # ── Test set final evaluation ──
    best_pipeline = trained_pipelines[best_model_name]
    y_test_pred_log = best_pipeline.predict(X_test)
    y_test_pred = np.expm1(y_test_pred_log)
    y_test_true = np.expm1(y_test)
    test_metrics = evaluate(y_test_true, y_test_pred)

    print(f"\n📈 Test Set Metrics ({best_model_name}):")
    print(f"   R²    : {test_metrics['r2']:.4f}")
    print(f"   RMSE  : ${test_metrics['rmse']:,.0f}")
    print(f"   MAE   : ${test_metrics['mae']:,.0f}")
    print(f"   MAPE  : {test_metrics['mape']:.1f}%")

    # ── Save artifacts ──
    joblib.dump(best_pipeline, BEST_MODEL_PATH, compress=3)
    joblib.dump(trained_pipelines, ALL_MODELS_PATH, compress=3)

    pool_meta = {
        "best_model": best_model_name,
        "pool_results": pool_results,
        "test_metrics": test_metrics,
        "feature_count": len(all_features),
        "training_samples": len(X_train),
    }
    with open(POOL_META_PATH, "w") as f:
        json.dump(pool_meta, f, indent=2)

    print(f"\n✅ All models saved to {MODEL_DIR}")
    print("   best_model.joblib  — best pipeline")
    print("   all_models.joblib  — full model pool")
    print("   model_pool_meta.json — performance metadata")


if __name__ == "__main__":
    train()
