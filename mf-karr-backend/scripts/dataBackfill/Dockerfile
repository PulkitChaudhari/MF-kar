# Use Python 3.9 slim image as base
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install required system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create necessary directories
RUN mkdir -p /app

# Copy only the required files
COPY dbDataBackfill.py /app
COPY allMfData.py /app
COPY constants.py /app
COPY requirements.txt /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set the output directory for SQL dump
VOLUME ["/app"]

# Run the dbDataBackfill.py script
ENTRYPOINT ["python","dbDataBackfill.py"]
