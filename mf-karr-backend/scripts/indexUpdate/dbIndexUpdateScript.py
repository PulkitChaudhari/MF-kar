import psycopg2
from datetime import datetime, timedelta
import pandas as pd
import time
import requests  # Add this import
import yfinance as yf
# from utils.db_config import get_db_connection

# Database connection parameters
conn = psycopg2.connect(
    dbname='postgres',
    user='postgres',
    password='Pulkit#0102',
    host='mfkarrdatabase.cz0iiwuys84w.ap-south-1.rds.amazonaws.com',
    port='5432'
)

# conn = psycopg2.connect(
#     dbname='postgres',
#     user='admin',
#     password='admin',
#     host='localhost',
#     port='5432'
# )

# indices = nse_get_index_list()
indices = ['^NSEI']

cursor = conn.cursor()

not_successful = []

def main():
    for index in indices:
        todaydate = datetime.now()
        yesterday = todaydate - timedelta(days=1)
        start_date = yesterday.strftime("%Y-%m-%d")
        end_date=todaydate.strftime("%Y-%m-%d")

        ticker = yf.Ticker(index)
        data = ticker.history(start=start_date, end=end_date, interval="1d")

        print(f"Data fetched between {start_date} and {end_date} for {index} :- \n",data.head())

        # time.sleep(3)

        if len(data) == 0:
            not_successful.append(index)
        else:

            for index, row in data.iterrows():

                timestamp = index.to_pydatetime()
                formatted_date = timestamp.strftime("%d-%m-%Y")

                cursor.execute(f"""
                    SELECT COUNT(*) FROM index_nifty_50
                    WHERE nav_date=TO_DATE('{formatted_date}', 'dd-mm-yyyy')
                """)
                results = cursor.fetchall()

                if results and results[0][0] == 0:
                    cursor.execute(f"""
                        INSERT INTO index_nifty_50 (nav_date, nav_value)
                        VALUES (TO_DATE('{formatted_date}', 'dd-mm-yyyy'), {round(float(row['Close']),2)})
                    """)
                    print(f"Insertion sucessful for {index} with {formatted_date}.")
            
                else:
                    print(f"Duplicate entry for {index} with {formatted_date} exists.")


    if len(not_successful) > 0:
        print("Insert not successful for following funds - ")
        for index in not_successful:
            print(index)

    # # Commit the changes and close connections
    conn.commit()
    conn.close()
    cursor.close()

if __name__ == "__main__":
    main()