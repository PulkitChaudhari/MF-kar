from scripts.allMfData import mf_data
class GreetingService:
    @staticmethod
    def create_greeting(name: str) -> dict:
        """
        Creates a greeting message for the given name
        """
        return {'message': f'Hello, {name}, length is {len(mf_data)}!'}

    @staticmethod
    def search_schemes(name: str) -> dict:
        """
        Searches for mutual fund schemes containing the given name
        Returns a dictionary with count, message and matching schemes
        """
        matching_funds = [
            fund for fund in mf_data 
            if name.lower() in fund['schemeName'].lower()
        ]
        
        return matching_funds