from typing import List
from flask import Flask, jsonify, request
from flask_cors import CORS
from services.instrument_service import InstrumentService
from services.portfolio_service import PortfolioService
from services.index_service import IndexService

app = Flask(__name__)

# Enable CORS for all routes and allow specific origins
CORS(app)  # Adjust the origin as needed

@app.route('/api/instruments/<string:instrumentNamePattern>', methods=['GET'])
def getInstruments(instrumentNamePattern):
    result = instrumentService.searchInstruments(instrumentNamePattern)
    return jsonify(result)

@app.route('/api/instrument', methods=['POST'])
def getInstrumentData():
    data = request.get_json()  # Retrieve the JSON body from the request
    instrumentCode = int(data.get('instrumentCode'))  # Extract instrumentCode from the body
    timePeriod = int(data.get('timePeriod'))  # Extract timePeriod from the body
    result = instrumentService.getInstrumentInfo(instrumentCode, timePeriod)
    return jsonify(result)

@app.route('/api/index', methods=['POST'])
def getIndexData():
    data = request.get_json()  # Retrieve the JSON body from the request
    instrumentCode = data.get('indexCode')  # Extract instrumentCode from the body
    timePeriod = int(data.get('timePeriod'))  # Extract timePeriod from the body
    result = indexService.getIndexInfo(instrumentCode, timePeriod)
    return jsonify(result)

@app.route('/api/portfolio/save', methods=['POST'])
def savePortfolio():
    data = request.get_json() 
    emailId = str(data.get('emailId'))
    instrumentsData = list[dict](data.get('instrumentsData'))
    portfolioName = str(data.get('portfolioName'))
    result = PortfolioService.savePortfolioForUser(emailId, instrumentsData,portfolioName)
    return jsonify(result)

@app.route('/api/portfolio/getPortfolios/<string:emailId>', methods=['GET'])
def getPortfolios(emailId):
    result = PortfolioService.getPortfoliosForUser(emailId)
    return jsonify(result)

if __name__ == "__main__":
    instrumentService = InstrumentService()
    portfolioService = PortfolioService()
    indexService = IndexService()
    app.run(host='0.0.0.0', port=8081, debug=True)