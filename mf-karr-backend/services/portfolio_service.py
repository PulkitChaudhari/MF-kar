from scripts.allMfData import mf_data
from scripts.constants import SORTED_RESULTS
import psycopg2
from datetime import datetime, timedelta
from typing import List  # Importing List from typing
import json  # Importing json module
from utils.db_config import get_db_connection

class PortfolioService:

    def savePortfolioForUser(self,emailId: str, instrumentsData: List[dict], portfolioName: str) -> dict:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(f"""
            SELECT COUNT(*) FROM user_portfolios where portfolioname=%s and email_id=%s
        """, (portfolioName,emailId )) 

        result:tuple = cursor.fetchall()

        if result and result[0][0] == 0:
            instrumentsDataJson = json.dumps(instrumentsData)
            cursor.execute(f"""
                INSERT INTO user_portfolios (email_id, instrumentsdata, portfolioname) values (%s, %s, %s)
            """, (emailId, instrumentsDataJson, portfolioName))
            self.closeConnection(conn,cursor)
            return self.createPayload("success","Saved Successfully",f"""{portfolioName} saved successfully""")

        self.closeConnection(conn,cursor)
        return self.createPayload("danger","Save Failed","A Portfolio with this name already exists")
    
    def createPayload(self,type:str,title:str,description:str): 
        return {
            "type": type,
            "title": title,
            "description": description
        }
    
    def closeConnection(self,conn,cursor): 
        conn.commit()
        cursor.close()
        conn.close()

    def getPortfoliosForUser(self,emailId: str) -> dict:
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

        cursor.close()
        conn.close()
        return result

