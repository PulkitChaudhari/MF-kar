from scripts.allMfData import mf_data
import requests  # Importing requests library

class InstrumentService:
    @staticmethod
    def searchInstruments(instrumentNamePattern: str) -> dict:
        matching_funds = [
            fund for fund in mf_data 
            if instrumentNamePattern.lower() in fund['instrumentName'].lower()
        ]
        return matching_funds
    
    @staticmethod
    def getInstrumentInfo(instrumentCode: int) -> dict:
        response = requests.get(f'https://api.mfapi.in/mf/{instrumentCode}')  # Making the API call
        matching_funds = [
            fund for fund in mf_data 
            if instrumentCode == fund['instrumentCode']
        ]
        if response.status_code == 200:
            data = response.json()
            return {
                instrumentCode: {
                    'instrumentName': matching_funds[0].get('instrumentName'), # Assuming 'schemeName' is in the response
                    'instrumentData': data.get('data')  # Returning the entire data as instrumentData
                }
            }
        return {}  # Returning an empty dict if the request fails