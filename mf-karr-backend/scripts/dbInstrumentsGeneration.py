import psycopg2
from allMfData import mf_data
from utils.db_config import get_db_connection

# Database connection configuration
# conn = psycopg2.connect(
#     dbname='postgres',
#     user='admin',
#     password='admin',
#     host='localhost',
#     port='5432'
# )
# conn = psycopg2.connect(
#     dbname='postgres',
#     user='postgres',
#     password='Pulkit#0102',
#     host='mfkarrdatabase.cz0iiwuys84w.ap-south-1.rds.amazonaws.com',
#     port='5432'
# )
cursor = conn.cursor()

# Function to insert data into the PostgreSQL table
def insert_mf_data(mf_data):
    for fund in mf_data:
        cursor.execute(f"""
            INSERT INTO mf_data (instrumentCode, instrumentName)
            VALUES ({fund['instrumentCode']}, '{fund['instrumentName'].replace("'", "''")}')
        """,) 
        print(f"""Data inserted successfully for {fund['instrumentCode']}""")

def create_mf_data_table():
    cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS mf_data (
            instrumentCode INT,
            instrumentName VARCHAR(1000)
        )
    """)

def main():
    conn = get_db_connection()
    cursor = conn.cursor()
    create_mf_data_table()
    insert_mf_data(mf_data)
    conn.commit()
    print("Commit successful")
    cursor.close()
    conn.close()

main()
