from scripts.allMfData import mf_data
from scripts.constants import SORTED_RESULTS
import psycopg2
from datetime import datetime, timedelta
from typing import List  # Importing List from typing
import json  # Importing json module
from ..db_config import get_db_connection

class PortfolioService:
    
    @staticmethod
    def savePortfolioForUser(emailId: str, instrumentsData: List[dict], portfolioName: str) -> dict:
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
        print(portfolioName)
        cursor.execute(f"""
            SELECT COUNT(*) FROM user_portfolios where portfolioname=%s and email_id=%s
        """, (portfolioName,emailId )) 

        result = cursor.fetchall()
        print(result)

        resp = "Duplicate Portfolio name"

        if result and result[0][0] == 0:
            instrumentsDataJson = json.dumps(instrumentsData)
            print(instrumentsDataJson)
            cursor.execute(f"""
                INSERT INTO user_portfolios (email_id, instrumentsdata, portfolioname) values (%s, %s, %s)
            """, (emailId, instrumentsDataJson, portfolioName))  # Using parameterized query for safety
            print(instrumentsDataJson)
            resp = "successful"

        conn.commit()
        print("Commit successful")
        cursor.close()
        conn.close()
        return resp
    

    @staticmethod
    def getPortfoliosForUser(emailId: str) -> dict:
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

        cursor.execute(f"""
            SELECT * FROM user_portfolios where email_id='{emailId}'
        """) 

        result = cursor.fetchall()

        print("Commit successful")
        cursor.close()
        conn.close()
        return result

