from scripts.allMfData import mf_data
from scripts.constants import SORTED_RESULTS
import psycopg2
from datetime import datetime, timedelta

class InstrumentService:

    @staticmethod
    def searchInstruments(instrumentNamePattern: str) -> dict:
        matching_funds = [
            fund for fund in mf_data 
            if instrumentNamePattern.lower() in fund['instrumentName'].lower()
        ]
        return matching_funds
    
    @staticmethod
    def getInstrumentInfo(instrumentCode: int, timePeriod: int) -> dict:
        # response = requests.get(f'https://api.mfapi.in/mf/{instrumentCode}')  # Making the API call

        # Connect to PostgreSQL database
        # conn = psycopg2.connect(
        #     dbname='postgres',
        #     user='postgres',
        #     password='Pulkit#0102',
        #     host='mfkarrdatabase.cz0iiwuys84w.ap-south-1.rds.amazonaws.com',
        #     port='5432'
        # )
        conn = psycopg2.connect(
            dbname='postgres',
            user='admin',
            password='admin',
            host='localhost',
            port='5432'
        )
        cursor = conn.cursor()

        # Get today's date
        today = datetime.today()
        # Calculate the threshold date by subtracting the timePeriod in years
        threshold_date = today - timedelta(days=timePeriod * 365)  # Approximate year length

        for keys in SORTED_RESULTS: 
            if (SORTED_RESULTS[keys][0] <= instrumentCode and SORTED_RESULTS[keys][1] >= instrumentCode): 
                cursor.execute(f"""
                    SELECT nav_date, nav_value 
                    FROM mf_data_results_{keys[0]}_{keys[1]} 
                    WHERE fund_id={instrumentCode} 
                    AND nav_date >= '{threshold_date.strftime('%Y-%m-%d')}'
                    ORDER BY nav_date 
                """)
                data = cursor.fetchall() 

                matching_funds = [
                    fund for fund in mf_data 
                    if instrumentCode == fund['instrumentCode']
                ]
                return {
                    instrumentCode: {
                        'instrumentName': matching_funds[0].get('instrumentName'), # Assuming 'schemeName' is in the response
                        'instrumentData': data # Returning the entire data as instrumentData
                    }
                }
        return {}  # Returning an empty dict if the request fails