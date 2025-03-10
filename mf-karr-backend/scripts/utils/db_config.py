import psycopg2

def get_db_connection():
    """
    Returns a connection to the PostgreSQL database.
    """
    return psycopg2.connect(
        dbname='postgres',
        user='pulkitchaudhari',
        password='admin',
        host='localhost',
        port='5432'
    ) 
    # return psycopg2.connect(
    #     dbname='postgres',
    #     user='postgres',
    #     password='Pulkit#0102',
    #     host='mfkarrdatabase.cz0iiwuys84w.ap-south-1.rds.amazonaws.com',
    #     port='5432'
    # )