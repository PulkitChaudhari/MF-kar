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
RUN mkdir -p /app/data /app/scripts

# Copy only the required files
COPY dbGenerator.py /app/scripts/
COPY allMfData.py /app/scripts/
COPY requirements.txt /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Run the script with arguments for starting and ending indexes
ENTRYPOINT ["python","scripts/dbGenerator.py"]