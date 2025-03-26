from typing import List
from flask import Flask, jsonify, request
from flask_cors import CORS
from services.instrument_service import InstrumentService
from services.portfolio_service import PortfolioService
from services.index_service import IndexService
from services.portfolio_analysis import PortfolioAnalysis
from services.portfolio_management import PortfolioManagement
from services.encryption_service import EncryptionService

app = Flask(__name__)

# Enable CORS for all routes and allow specific origins
CORS(app)  # Adjust the origin as needed


def encrypt_response(data):
    """Helper function to encrypt response data"""
    return jsonify(encryption_service.encrypt(data))

@app.route('/api/instruments/<string:instrumentNamePattern>', methods=['GET'])
def getInstruments(instrumentNamePattern):
    result = instrumentService.searchInstruments(instrumentNamePattern)
    return encrypt_response(result)

@app.route('/api/instrument', methods=['POST'])
def getInstrumentData():
    data = request.get_json()  # Retrieve the JSON body from the request
    instrumentCode = int(data.get('instrumentCode'))  # Extract instrumentCode from the body
    timePeriod = int(data.get('timePeriod'))  # Extract timePeriod from the body
    result = instrumentService.getInstrumentInfo(instrumentCode, timePeriod)
    return encrypt_response(result)

@app.route('/api/index', methods=['POST'])
def getIndexData():
    data = request.get_json()  # Retrieve the JSON body from the request
    instrumentCode = data.get('indexCode')  # Extract instrumentCode from the body
    timePeriod = int(data.get('timePeriod'))  # Extract timePeriod from the body
    result = indexService.getIndexInfo(instrumentCode, timePeriod)
    return encrypt_response(result)

@app.route('/api/portfolio/save', methods=['POST'])
def savePortfolio():
    data = request.get_json() 
    emailId = str(data.get('emailId'))
    instrumentsData = list[dict](data.get('instrumentsData'))
    portfolioName = str(data.get('portfolioName'))
    result = portfolioService.savePortfolioForUser(emailId, instrumentsData,portfolioName)
    return encrypt_response(result)

@app.route('/api/portfolio/getPortfolios/<string:emailId>', methods=['GET'])
def getPortfolios(emailId):
    result = portfolioService.getPortfoliosForUser(emailId)
    return encrypt_response(result)

@app.route('/api/portfolio/analyze', methods=['POST'])
def analyze_portfolio():
    data = request.get_json()
    
    instruments_data = data.get('instrumentsData', {})
    time_period = int(data.get('timePeriod', 1))
    initial_amount = float(data.get('initialAmount', 100))
    investment_mode = data.get('investmentMode', 'lump-sum')
    
    portfolio_analysis = PortfolioAnalysis()
    result = portfolio_analysis.process_portfolio_data(
        instruments_data, 
        time_period, 
        initial_amount, 
        investment_mode
    )
    
    return encrypt_response(result)

# Add endpoint for index comparison
@app.route('/api/portfolio/compare-index', methods=['POST'])
def compare_with_index():
    data = request.get_json()
    
    index_name = data.get('indexName', 'nifty_50')
    time_period = int(data.get('timePeriod', 1))
    initial_amount = float(data.get('initialAmount', 100))
    investment_mode = data.get('investmentMode', 'lump-sum')
    
    portfolio_analysis = PortfolioAnalysis()
    result = portfolio_analysis.process_index_data(
        index_name,
        time_period,
        initial_amount,
        investment_mode
    )
    
    return encrypt_response(result)

# Add these endpoints
@app.route('/api/portfolio/add-instrument', methods=['POST'])
def add_instrument():
    data = request.get_json()
    
    instrument_code = data.get('instrumentCode')
    time_period = int(data.get('timePeriod', 1))
    current_instruments = data.get('currentInstruments', {})
    
    result = portfolio_management.add_instrument(
        instrument_code,
        time_period,
        current_instruments
    )
    return encrypt_response(result)

@app.route('/api/portfolio/remove-instrument', methods=['POST'])
def remove_instrument():
    data = request.get_json()
    
    instrument_code = data.get('instrumentCode')
    current_instruments = data.get('currentInstruments', {})
    
    result = portfolio_management.remove_instrument(
        instrument_code,
        current_instruments
    )
    
    return encrypt_response(result)

@app.route('/api/portfolio/change-time-period', methods=['POST'])
def change_time_period():
    data = request.get_json()
    
    time_period = int(data.get('timePeriod', 1))
    current_instruments = data.get('currentInstruments', {})
    
    result = portfolio_management.change_time_period(
        time_period,
        current_instruments
    )
    
    return encrypt_response(result)

@app.route('/api/portfolio/load', methods=['POST'])
def load_portfolio():
    data = request.get_json()
    
    portfolio_data = data.get('portfolioData', {})
    time_period = int(data.get('timePeriod', 1))
    
    result = portfolio_management.load_portfolio(
        portfolio_data,
        time_period
    )
    
    return encrypt_response(result)

if __name__ == "__main__":
    portfolio_management = PortfolioManagement()
    encryption_service = EncryptionService()
    instrumentService = InstrumentService()
    portfolioService = PortfolioService()
    indexService = IndexService()
    app.run(host='0.0.0.0', port=8081, debug=True)