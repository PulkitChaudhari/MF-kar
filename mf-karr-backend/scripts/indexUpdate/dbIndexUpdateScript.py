from nsepython import index_history
import psycopg2
from datetime import datetime
import pandas as pd
import time
import requests  # Add this import
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
indices = ['NIFTY 50']

cursor = conn.cursor()

not_successful = []

def main():
    for index in indices:
        end_date = datetime.now().strftime("%d-%m-%Y")
        start_date = end_date
        url = f"https://www.nseindia.com/api/historical/indicesHistory?indexType={index.replace(' ', '%20')}&from={start_date}&to={end_date}"
        resp = requests.get(url,headers={
            # "Host": "www.nseindia.com",
            # "Referer": "https://www.nseindia.com/get-quotes/equity?symbol=ADANIPORTS",
            "X-Requested-With": "XMLHttpRequest",
            "pragma": "no-cache",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            })

        data = resp.json()['data']['indexCloseOnlineRecords']
        print(f"Data fetched between {start_date} and {end_date} for {index} :- \n",data)

        time.sleep(3)

        if len(data) == 0:
            not_successful.append(index)
        else:
            # date_format = "%d-%b-%Y"
            # date_variable = datetime.strptime(end_date, date_format)
            # db_formatted_date = date_variable.strftime("%d-%m-%Y")

            for row in data:

                timestamp = datetime.strptime(row['EOD_TIMESTAMP'], "%d-%b-%Y")
                formatted_date = timestamp.strftime("%d-%m-%Y")

                cursor.execute(f"""
                    SELECT COUNT(*) FROM index_{index.lower().replace(' ', '_')} 
                    WHERE nav_date=TO_DATE('{formatted_date}', 'dd-mm-yyyy')
                """)
                results = cursor.fetchall()

                if results and results[0][0] == 0:
                    cursor.execute(f"""
                        INSERT INTO index_{index.lower().replace(' ', '_')} (nav_date, nav_value)
                        VALUES (TO_DATE('{formatted_date}', 'dd-mm-yyyy'), {float(row['EOD_CLOSE_INDEX_VAL'])})
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
