from nsepython import index_history
import psycopg2
from datetime import datetime
import pandas as pd
import time
from utils.db_config import get_db_connection

# Database connection parameters
conn = get_db_connection()

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
        end_date = datetime.now().strftime("%d-%b-%Y")  # Get today's date
        start_date = end_date
        data = index_history(index,start_date,end_date)
        print(f"Data fetched for {index} :- \n",data)

        time.sleep(3)

        if data.empty:
            not_successful.append(index)
        else:
            date_format = "%d-%b-%Y"
            date_variable = datetime.strptime(end_date, date_format)
            db_formatted_date = date_variable.strftime("%d-%m-%Y")

            for symbol, row in data.iterrows():

                cursor.execute(f"""
                    SELECT COUNT(*) FROM index_{index.lower().replace(' ', '_')} 
                    WHERE nav_date=TO_DATE('{db_formatted_date}', 'dd-mm-yyyy')
                """)
                results = cursor.fetchall()

                if results and results[0][0] == 0:
                    cursor.execute(f"""
                        INSERT INTO index_{index.lower().replace(' ', '_')} (nav_date, nav_value)
                        VALUES (TO_DATE('{db_formatted_date}', 'dd-mm-yyyy'), {float(row['CLOSE'])})
                    """)
                    print(f"Insertion sucessful for {index} with {db_formatted_date}.")
            
                else:
                    print(f"Duplicate entry for {index} with {db_formatted_date} exists.")


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
