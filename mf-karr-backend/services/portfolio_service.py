from scripts.allMfData import mf_data
from scripts.constants import SORTED_RESULTS
import psycopg2
from datetime import datetime, timedelta
from typing import List  # Importing List from typing
import json  # Importing json module

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
        conn = psycopg2.connect(
            dbname='postgres',
            user='pulkitchaudhari',
            password='admin',
            host='localhost',
            port='5432'
        )
        cursor = conn.cursor()

        cursor.execute(f"""
            SELECT COUNT(*) FROM user_portfolios where portfolioname=%s and email_id=%s
        """, (portfolioName,emailId )) 

        result = cursor.fetchall()

        resp = "Duplicate Portfolio name"

        if (result == 0):
            instrumentsDataJson = json.dumps(instrumentsData)
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