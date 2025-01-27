from flask import Flask, jsonify, request
from flask_cors import CORS
from services.instrument_service import InstrumentService

app = Flask(__name__)
CORS(app)

@app.route('/api/instruments/<string:instrumentNamePattern>', methods=['GET'])
def getInstruments(instrumentNamePattern):
    result = instrumentService.searchInstruments(instrumentNamePattern)
    return jsonify(result)

@app.route('/api/instrument/<int:instrumentCode>', methods=['GET'])
def getInstrument(instrumentCode):
    result = instrumentService.getInstrumentInfo(instrumentCode)
    return jsonify(result)


if __name__ == "__main__":
    instrumentService = InstrumentService()
    app.run(host='0.0.0.0',port=8081,debug="true")
