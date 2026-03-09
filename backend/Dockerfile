# ---- Build stage ----
FROM python:3.10-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ---- Runtime stage ----
FROM python:3.10-slim

WORKDIR /app

# Copy only the installed packages from the builder
COPY --from=builder /install /usr/local

# Copy application code
COPY . .

# Remove files not needed at runtime
RUN rm -f .env Dockerfile

# Non-root user for security
RUN adduser --disabled-password --no-create-home appuser
USER appuser

# Fly.io sets PORT dynamically (default 8080)
ENV PORT=8080
EXPOSE 8080

# Production start command — reads $PORT at runtime
CMD uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2 --log-level info
