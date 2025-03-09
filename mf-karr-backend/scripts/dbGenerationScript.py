import json
import psycopg2
import os
from ..db_config import get_db_connection

def main():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Path to the folder containing JSON files
    folder_path = './MutualFundsResult'

    # Initialize a dictionary to store (number1, number2) mapped to a pair of result[0] and result[1]
    results_map = {}

    # Loop through each JSON file in the folder
    for fileIndex,filename in enumerate(os.listdir(folder_path)):
        if filename.endswith('.json'):
            file_path = os.path.join(folder_path, filename)

            filename = filename.removesuffix('.json')

            suffix = filename.split('_')[-2:]  # Get the last two parts after splitting by '_'
            number1, number2 = suffix[0], suffix[1]  # Store them in two variables

            # print("Insertion for",filename,"in progress")

            # cursor.execute(f"""
            #     DROP TABLE IF EXISTS {filename}
            # """)

            # Create table if it doesn't exist
            # cursor.execute(f"""
            #     CREATE TABLE IF NOT EXISTS {filename} (
            #         nav_date DATE,
            #         nav_value NUMERIC,
            #         fund_id INT
            #     )
            # """)

            # print(filename)

            cursor.execute(f"""
                select min(fund_id), max(fund_id) from {filename};	
            """)
            
            result = cursor.fetchone()  # Fetch the result of the SELECT statement
            # Store the result in the map using (number1, number2) as the key
            results_map[(int(number1), int(number2))] = (result[0], result[1])  # Map (number1, number2) to the pair of results
            # print("Min fund_id:", result[0], "Max fund_id:", result[1], "Table name:",filename)  # Print the results

            # # Load JSON data from the file
            # with open(file_path) as f:
            #     data = json.load(f)

            # # # Loop through each key in the JSON object
            # for index,instrument in enumerate(data.items()):
            #     fund_id,fund_data = instrument
            # #     # Insert data into the table
            #     for entry in fund_data['data']:
            #         cursor.execute(f"""
            #             INSERT INTO {filename} (nav_date, nav_value, fund_id)
            #             VALUES (TO_DATE(%s, 'dd-mm-yyyy'), %s, %s)
            #         """, (entry['date'], entry['nav'], fund_id))
            
            # print("Insertion for",filename,"completed. Progress - ",fileIndex+1,"/",len(os.listdir(folder_path)))

    # Sort the results_map by number1 and store it in a constant variable
    SORTED_RESULTS = dict(sorted(results_map.items()))

    # Print the sorted results in a format suitable for copying
    print("SORTED_RESULTS = {")
    for key, value in SORTED_RESULTS.items():
        print(f"    {key}: {value},")
    print("}")

    previous_max_fund_id = None  # Initialize a variable to track the previous maximum fund_id

    # for key, value in SORTED_RESULTS.items():
    #     min_fund_id, max_fund_id = value
    #     if previous_max_fund_id is not None and min_fund_id <= previous_max_fund_id:
        # print(f"Warning: Key {key} has a min fund_id {min_fund_id} not greater than previous max fund_id {previous_max_fund_id}.")
    # previous_max_fund_id = max_fund_id  # Update the previous maximum fund_id
    # print(f"Key: {key}, Min fund_id: {min_fund_id}, Max fund_id: {max_fund_id}")

    # print("All insertions successful. Commiting the changes")

    # Commit changes and close the connection
    conn.commit()

    print("Commit successful")

    cursor.close()
    conn.close()

if __name__ == "__main__":
    main()