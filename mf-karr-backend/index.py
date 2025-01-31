from flask import Flask, jsonify, request
from flask_cors import CORS
from services.instrument_service import InstrumentService

app = Flask(__name__)

# Enable CORS for all routes and allow specific origins
CORS(app)  # Adjust the origin as needed

@app.route('/api/instruments/<string:instrumentNamePattern>', methods=['GET'])
def getInstruments(instrumentNamePattern):
    result = instrumentService.searchInstruments(instrumentNamePattern)
    return jsonify(result)

@app.route('/api/instrument', methods=['POST'])
def getInstrument():
    data = request.get_json()  # Retrieve the JSON body from the request
    instrumentCode = int(data.get('instrumentCode'))  # Extract instrumentCode from the body
    timePeriod = int(data.get('timePeriod'))  # Extract timePeriod from the body
    result = instrumentService.getInstrumentInfo(instrumentCode, timePeriod)
    return jsonify(result)

if __name__ == "__main__":
    instrumentService = InstrumentService()
    app.run(host='0.0.0.0', port=8081, debug=True)