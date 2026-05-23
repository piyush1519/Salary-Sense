FROM python:3.11-slim

WORKDIR /app

# System deps for scientific Python
RUN apt-get update && apt-get install -y \
    curl build-essential gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Copy data into the image (will be overridden by volume if present)
COPY data/ /app/data/

# Train model on startup if not already trained
CMD ["sh", "-c", "python train.py && uvicorn main:app --host 0.0.0.0 --port 8000"]
