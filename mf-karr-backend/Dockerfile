# Build stage
FROM python:3.11-slim as builder

# Set working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Final stage
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app .
COPY --from=builder /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/

# Expose port
EXPOSE 8081

# Set environment variables
ENV FLASK_APP=index.py
ENV FLASK_ENV=production

# Run the application
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=8081"] 