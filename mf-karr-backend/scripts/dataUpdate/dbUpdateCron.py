import requests
import time
from allMfData import mf_data
from constants import SORTED_RESULTS
import psycopg2
from datetime import datetime
import sys
from scripts.utils.db_config import get_db_connection

# Constants
API_BASE_URL = "https://api.mfapi.in/mf/"
DELAY_SECONDS = 0

def fetch_latest_mf_data(scheme_code: int) -> dict:
    try:
        url = f"{API_BASE_URL}{scheme_code}/latest"
        print(f"Fetching data for scheme: {scheme_code}")
        
        response = requests.get(url)
        response.raise_for_status()
        
        time.sleep(DELAY_SECONDS)  # Add delay between requests
        return response.json()
        
    except requests.RequestException as e:
        error_msg = f"Error fetching scheme {scheme_code}: {str(e)}"
        print(error_msg)

def main():
    conn = psycopg2.connect(
        dbname='postgres',
        user='postgres',
        password='Pulkit#0102',
        host='mfkarrdatabase.cz0iiwuys84w.ap-south-1.rds.amazonaws.com',
        port='5432'
    )
    cursor = conn.cursor()

    start_index = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    end_index = int(sys.argv[2]) if len(sys.argv) > 2 else 1

    scheme_codes = [mf['instrumentCode'] for mf in mf_data if start_index <= mf['instrumentCode'] and end_index > mf['instrumentCode']]

    print(f"Starting to fetch latest data for mutual fund schemes...")

    for scheme_code in scheme_codes:
        results = fetch_latest_mf_data(scheme_code)
        date = results['data'][0]['date']
        nav = results['data'][0]['nav']
        for keys in SORTED_RESULTS: 
            if (SORTED_RESULTS[keys][0] <= scheme_code and SORTED_RESULTS[keys][1] >= scheme_code): 
                cursor.execute(f"""
                    SELECT MAX(nav_date) FROM mf_data_results_{keys[0]}_{keys[1]} where fund_id={scheme_code}
                """)
                results = cursor.fetchall()
                if results and results[0][0] is not None:
                    lastAvailableDate = results[0][0] 
                    lastAvailableDate = str(lastAvailableDate)
                    year, month, day = lastAvailableDate.split('-')
                    lastAvailableDate = datetime(int(year), int(month), int(day))
                    datetime_object = datetime.strptime(date, '%d-%m-%Y')  # Assuming date is in 'dd-mm-yyyy' format
                    if (lastAvailableDate >= datetime_object):
                        print(f"""Nothing to insert for {scheme_code} in mf_data_results_{keys[0]}_{keys[1]}""")
                        break  
                cursor.execute(f"""
                    INSERT INTO mf_data_results_{keys[0]}_{keys[1]} (nav_date, nav_value, fund_id)
                    VALUES (TO_DATE(%s, 'dd-mm-yyyy'), %s, %s)
                """, (date, nav, scheme_code))
                print(f"""Insertion for mf_data_results_{keys[0]}_{keys[1]} completed. for {scheme_code} for date {date}""")
                # Commit changes and close the connection
    conn.commit()
    print("Commit successful")
    cursor.close()
    conn.close()
            

if __name__ == "__main__":
    main()