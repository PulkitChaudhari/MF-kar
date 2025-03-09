import psycopg2
from utils.db_config import get_db_connection
from datetime import datetime, timedelta
import pandas as pd

class IndexService:
    
    @staticmethod
    def getIndexInfo(indexCode: int, timePeriod: int) -> dict:
        # Connect to PostgreSQL database
        # conn = psycopg2.connect(
        #     dbname='postgres',
        #     user='postgres',
        #     password='Pulkit#0102',
        #     host='mfkarrdatabase.cz0iiwuys84w.ap-south-1.rds.amazonaws.com',
        #     port='5432'
        # )
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get today's date
        today = datetime.today()
        # Calculate the threshold date by subtracting the timePeriod in years
        threshold_date = today - timedelta(days=timePeriod * 365)  # Approximate year length

        cursor.execute(f"""
            SELECT nav_date, nav_value 
            FROM index_{indexCode} 
            WHERE nav_date >= '{threshold_date.strftime('%Y-%m-%d')}'
            ORDER BY nav_date 
        """)
        data = cursor.fetchall() 

        # Transforming the data into the desired format
        # data = [{'date': row[0], 'nav': row[1]} for row in data]

        return {
            indexCode: {
                'indexCode': indexCode, # Assuming 'schemeName' is in the response
                'indexData': data # Returning the transformed data
            }
        }
        return {}  # Returning an empty dict if the request fails