from nsepython import *
import psycopg2
from datetime import datetime
import pandas as pd
import time  # Import the time module

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

for index in indices:
    start_date = "01-Jan-2000"
    end_date = datetime.now().strftime("%d-%b-%Y")  # Get today's date
    data = index_history(index,start_date,end_date)
    print(f"Data fetched for {index}")

    time.sleep(3)

    if data.empty:
        not_successful.append(index)
    else:
        cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS index_{index.lower().replace(' ', '_')} (
                nav_date DATE,
                nav_value NUMERIC
            )
        """)

        for symbol, row in data.iterrows():
            cursor.execute(f"""
                INSERT INTO index_{index.lower().replace(' ', '_')} (nav_date, nav_value)
                VALUES (%s, %s)
            """, (row['HistoricalDate'], float(row['CLOSE'])))
        
        print(f"Insert successful for {index}")

if len(not_successful) > 0:
    
    print("Insert not successful for following funds - ")

    for index in not_successful:
        print(index)

# # Commit the changes and close connections
conn.commit()
conn.close()
cursor.close()
