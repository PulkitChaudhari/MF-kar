# Use Python 3.9 slim image as base
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install required system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy only the required files
COPY dbIndexUpdateScript.py /app
COPY requirements.txt /app
# COPY utils/ /app/utils/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Run the dbDataBackfill.py script
ENTRYPOINT ["python","dbIndexUpdateScript.py"]
