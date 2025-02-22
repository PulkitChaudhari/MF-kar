import requests
import time
from constants import SORTED_RESULTS
import psycopg2
from datetime import datetime
from allMfData import mf_data
import sys

# Connect to PostgreSQL database
# conn = psycopg2.connect(
#     dbname='postgres',
#     user='admin',
#     password='admin',
#     host='localhost',
#     port='5432'
# )

conn = psycopg2.connect(
    dbname='postgres',
    user='postgres',
    password='Pulkit#0102',
    host='mfkarrdatabase.cz0iiwuys84w.ap-south-1.rds.amazonaws.com',
    port='5432'
)
cursor = conn.cursor()

# Constants
API_BASE_URL = "https://api.mfapi.in/mf/"
# DELAY_SECONDS = float(sys.argv[0]) # Delay between requests to avoid rate limiting
DELAY_SECONDS = 0

def fetch_latest_mf_data(scheme_code: int) -> dict:
    try:
        url = f"{API_BASE_URL}{scheme_code}"
        print(f"Fetching data for scheme: {scheme_code}")
        
        response = requests.get(url)
        response.raise_for_status()
        
        time.sleep(DELAY_SECONDS)  # Add delay between requests
        return response.json()
        
    except requests.RequestException as e:
        error_msg = f"Error fetching scheme {scheme_code}: {str(e)}"
        print(error_msg)

def main():

    #Get starting and ending indexes from command line arguments
    start_index = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    end_index = int(sys.argv[2]) if len(sys.argv) > 2 else 1

    scheme_codes = [mf['instrumentCode'] for mf in mf_data if start_index <= mf['instrumentCode'] and end_index > mf['instrumentCode']]
    print(f"Starting to fetch latest data for mutual fund schemes...")

    # Open a file to write the SQL dump
    with open('mf_data_dump.sql', 'w') as dump_file:
        # Use the dynamic table name for the COPY statement

        for scheme_code in scheme_codes:
            results = fetch_latest_mf_data(scheme_code)
            data = results['data']

            for keys in SORTED_RESULTS: 
                if (SORTED_RESULTS[keys][0] <= scheme_code and SORTED_RESULTS[keys][1] >= scheme_code): 
                    tablename = keys[0], keys[1]
            
            dump_file.write(f"COPY mf_data_results_{tablename[0]}_{tablename[1]} (nav_date, nav_value, fund_id) FROM STDIN;\n")

            cursor.execute(f"""
                SELECT MAX(nav_date) FROM mf_data_results_{tablename[0]}_{tablename[1]} where fund_id={scheme_code}
            """)
            results = cursor.fetchall()
            if results and results[0][0] is not None:
                lastAvailableDate = results[0][0] 
                lastAvailableDate = str(lastAvailableDate)
                year, month, day = lastAvailableDate.split('-')
                lastAvailableDate = datetime(int(year), int(month), int(day))
            else:
                print(f"""No last max date found for %s""",scheme_code)
                break

            for nav_data in data:
                date = nav_data['date']
                nav = nav_data['nav']
                datetime_object = datetime.strptime(date, '%d-%m-%Y')  # Assuming date is in 'dd-mm-yyyy' format
                if (lastAvailableDate >= datetime_object):
                    break
                formatted_date = datetime_object.strftime('%Y-%m-%d')
                dump_file.write(f"{formatted_date}\t{nav}\t{scheme_code}\n")
            dump_file.write("\\.\n")
    conn.commit()
    cursor.close()
    conn.close()
            

if __name__ == "__main__":
    main()
