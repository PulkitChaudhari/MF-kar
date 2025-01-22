class GreetingService:
    @staticmethod
    def create_greeting(name: str) -> dict:
        """
        Creates a greeting message for the given name
        """
        return {'message': f'Hello, {name}!'} 