import requests
import json
import time
from typing import Dict, List, Any
from allMfData import mf_data
import sys

# Constants
API_BASE_URL = "https://api.mfapi.in/mf/"
DELAY_SECONDS = sys.argv[3] # Delay between requests to avoid rate limiting

class MutualFundFetcher:
    def __init__(self, output_file: str = "data/mf_data_results.json", error_file: str = "data/mf_data_errors.json"):
        self.output_file = output_file
        self.error_file = error_file
        self.results: Dict[str, Any] = {}
        self.errors: List[Dict[str, str]] = []

    def fetch_mf_data(self, scheme_code: int) -> None:
        """Fetch data for a single mutual fund scheme"""
        try:
            url = f"{API_BASE_URL}{scheme_code}"
            print(f"Fetching data for scheme: {scheme_code}")
            
            response = requests.get(url)
            response.raise_for_status()
            
            self.results[str(scheme_code)] = response.json()
            time.sleep(DELAY_SECONDS)  # Add delay between requests
            
        except requests.RequestException as e:
            error_msg = f"Error fetching scheme {scheme_code}: {str(e)}"
            print(error_msg)
            self.errors.append({
                "schemeCode": str(scheme_code),
                "error": error_msg
            })

    def save_results(self) -> None:
        """Save results and errors to files"""
        # Save successful results
        with open(self.output_file, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)

        # Save errors if any
        if self.errors:
            with open(self.error_file, 'w', encoding='utf-8') as f:
                json.dump(self.errors, f, indent=2, ensure_ascii=False)

def main():
    # Get scheme codes from the imported mf_data
    scheme_codes = [mf['schemeCode'] for mf in mf_data]
    
    # Get starting and ending indexes from command line arguments
    start_index = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    end_index = int(sys.argv[2]) if len(sys.argv) > 2 else 1

    output_file_name = "data/mf_data_results_"+ str(start_index) + "_" + str(end_index) + ".json"
    error_file_name = "data/mf_data_errors_"+ str(start_index) + "_" + str(end_index) + ".json"

    # Select the range of scheme codes
    scheme_codes = scheme_codes[start_index:end_index]
    
    fetcher = MutualFundFetcher(output_file = output_file_name,error_file= error_file_name)
    
    total_schemes = len(scheme_codes)
    print(f"Starting to fetch data for {total_schemes} mutual fund schemes...")

    for index, scheme_code in enumerate(scheme_codes, 1):
        fetcher.fetch_mf_data(scheme_code)
        print(f"Progress: {index}/{total_schemes} schemes processed")

    fetcher.save_results()
    
    print(f"\nProcess completed!")
    print(f"Results saved to: {fetcher.output_file}")
    if fetcher.errors:
        print(f"Errors saved to: {fetcher.error_file}")
        print(f"Total errors: {len(fetcher.errors)}")

if __name__ == "__main__":
    main()