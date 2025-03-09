import psycopg2

def get_db_connection():
    """
    Returns a connection to the PostgreSQL database.
    """
    return psycopg2.connect(
        dbname='postgres',
        user='admin',
        password='admin',
        host='localhost',
        port='5432'
    ) 