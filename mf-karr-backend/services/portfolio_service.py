from scripts.allMfData import mf_data
from scripts.constants import SORTED_RESULTS
import psycopg2
from datetime import datetime, timedelta
from typing import List  # Importing List from typing
import json  # Importing json module
from utils.db_config import get_db_connection

class PortfolioService:

    def savePortfolioForUser(self,emailId: str, instrumentsDataJson: str, portfolioName: str) -> dict:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(f"""
            SELECT 'DUPLICATE_PORTFOLIO' AS table_name, 
            (SELECT COUNT(*) FROM user_portfolios WHERE portfolioname=%s AND email_id=%s AND instrumentsdata=%s) AS count
            UNION ALL
            SELECT 'DUPLICATE_DATA' AS table_name, 
                (SELECT COUNT(*) FROM user_portfolios WHERE email_id=%s AND instrumentsdata=%s) AS count
            UNION ALL
            SELECT 'DUPLICATE_NAME' AS table_name, 
                (SELECT COUNT(*) FROM user_portfolios WHERE email_id=%s AND portfolioname=%s) AS count;
                """, (portfolioName,emailId,instrumentsDataJson,emailId,instrumentsDataJson,emailId,portfolioName)) 
        result:tuple = cursor.fetchall()

        if result[0][1] > 0:
            self.closeConnection(conn,cursor)
            return self.createPayload("danger","Duplicate Portfolio")
        elif result[1][1] > 0:
            self.closeConnection(conn,cursor)
            return self.createPayload("danger",f"""A Portfolio with selected Instruments already exists.""")
        elif result[2][1] > 0:
            self.closeConnection(conn,cursor)
            return self.createPayload("danger",f"""A Portfolio with "{portfolioName}" as name already exists.""")
        else:
            cursor.execute(f"""
                INSERT INTO user_portfolios (email_id, instrumentsdata, portfolioname) values (%s, %s, %s)
            """, (emailId, instrumentsDataJson, portfolioName))
            self.closeConnection(conn,cursor)
            return self.createPayload("success",f"""\"{portfolioName}\" saved successfully""")
    
    def replacePortfolio(self,emailId: str, instrumentsDataJson: str, portfolioName: str) -> dict:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(f"""
            DELETE FROM user_portfolios WHERE (email_id=%s AND instrumentsdata=%s) OR (email_id=%s and portfolioname=%s)
        """, (emailId, instrumentsDataJson,emailId, portfolioName))
        cursor.execute(f"""
            INSERT INTO user_portfolios (email_id, instrumentsdata, portfolioname) values (%s, %s, %s)
        """, (emailId, instrumentsDataJson,portfolioName))
        self.closeConnection(conn,cursor)
        return self.createPayload("success",f"""\"{portfolioName}\" saved successfully""")
    
    def deletePortfolio(self,emailId: str, portfolioName: str) -> dict:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(f"""
            SELECT * FROM user_portfolios WHERE (email_id=%s AND portfolioname=%s)
        """, (emailId, portfolioName))
        result = cursor.fetchall()
        print(result)
        cursor.execute(f"""
            DELETE FROM user_portfolios WHERE (email_id=%s AND portfolioName=%s)
        """, (emailId, portfolioName))
        self.closeConnection(conn,cursor)
        return self.createPayload("success",f"""\"{portfolioName}\" deleted successfully""")
    
    def createPayload(self,type:str,title:str): 
        return {
            "type": type,
            "title": title
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
        print(result)

        cursor.close()
        conn.close()
        return result

