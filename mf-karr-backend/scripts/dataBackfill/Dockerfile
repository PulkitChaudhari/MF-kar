# Use Python 3.9 slim image as base
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy only the required files
COPY dbDataBackfill.py /app/
COPY allMfData.py /app/
COPY constants.py /app/
COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set the output directory for SQL dump
VOLUME ["/app"]

# Run the dbDataBackfill.py script
CMD ["python", "dbDataBackfill.py"]
