from datetime import datetime
import json
from services.instrument_service import InstrumentService

class PortfolioManagement:
    def __init__(self):
        self.instrument_service = InstrumentService()
    
    def get_navs_for_range(self, api_data):
        """Convert API data to NAV format"""
        converted_data = []
        
        for idx in range(len(api_data) - 1, -1, -1):
            nav = float(api_data[idx][1])
            date = api_data[idx][0].strftime('%Y-%m-%d')
            # date = datetime.strptim   e(api_data[idx][0], "%Y-%m-%d")
            
            converted_data.append({
                "date": date,
                "nav": nav
            })
            
        converted_data.reverse()
        return converted_data
    
    def update_weight(self, instrument_data):
        """Update weights for instruments"""
        instrument_codes = list(instrument_data.keys())
        
        # Calculate base weight
        if len(instrument_codes) == 0:
            base_weight = 0
            remainder = 0
        else:    
            base_weight = 100 // len(instrument_codes)
            remainder = 100 % len(instrument_codes)
        
        # Distribute weights
        for code in instrument_codes:
            instrument_data[code]["weightage"] = base_weight
        
        # Distribute remainder to first instrument
        if remainder != 0 and len(instrument_codes) > 0:
            instrument_data[instrument_codes[0]]["weightage"] += remainder
            
        return instrument_data
    
    def calculate_cagr(self, navs_for_range, time_period):
        """Calculate CAGR from NAV data"""
        if not navs_for_range or len(navs_for_range) == 0:
            return "0.00"
            
        v_begin = navs_for_range[0]["nav"]
        v_final = navs_for_range[-1]["nav"]
        
        cagr = (pow(v_final / v_begin, 1 / time_period) - 1) * 100
        return "{:.2f}".format(cagr)
    
    def generate_instrument_data(self, instrument_code, time_period):
        """Generate instrument data with NAVs and CAGR"""
        # Get instrument data from service
        api_data = self.instrument_service.getInstrumentInfo(instrument_code, time_period)
        
        # Extract instrument data
        instrument_data = api_data[instrument_code]["instrumentData"]
        instrument_name = api_data[instrument_code]["instrumentName"]
        
        # Process NAVs
        print(instrument_data)
        navs_for_range = self.get_navs_for_range(instrument_data)
        
        # Calculate CAGR
        cagr = self.calculate_cagr(navs_for_range, time_period)
        
        # Create instrument object
        instrument_obj = {
            "instrumentName": instrument_name,
            "cagr": cagr,
            "weightage": "",
            "navData": navs_for_range
        }
        return instrument_obj
    
    def add_instrument(self, instrument_code, time_period, current_instruments):
        """Add an instrument to the portfolio"""
        if not instrument_code:
            return current_instruments
        
        # Generate instrument data
        instrument_data = self.generate_instrument_data(instrument_code, time_period)
        
        # Add to current instruments
        updated_instruments = current_instruments.copy()

        nav_data = instrument_data['navData']
        temparr = []
        for data in nav_data:
            date = data['date']
            nav = data['nav']
            temparr.append({"date":date,"nav":nav})

        instrument_data["navData"] = temparr

        updated_instruments[str(instrument_code)] = instrument_data
        # Update weights
        updated_instruments = self.update_weight(updated_instruments)
        return updated_instruments
    
    def remove_instrument(self, instrument_code, current_instruments):
        """Remove an instrument from the portfolio"""
        updated_instruments = current_instruments.copy()
        
        # Remove instrument
        if str(instrument_code) in updated_instruments:
            del updated_instruments[str(instrument_code)]
            
        # Update weights
        updated_instruments = self.update_weight(updated_instruments)
        
        return updated_instruments
    
    def change_time_period(self, time_period, current_instruments):
        """Update all instruments for a new time period"""
        updated_instruments = {}
        
        # Regenerate data for each instrument
        for code in current_instruments:
            instrument_data = self.generate_instrument_data(int(code), time_period)
            updated_instruments[code] = instrument_data
            
        # Update weights
        updated_instruments = self.update_weight(updated_instruments)
        
        return updated_instruments
    
    def load_portfolio(self, portfolio_data, time_period):
        """Load a saved portfolio with current time period"""
        instruments = portfolio_data.get("instruments", [])
        updated_instruments = {}
        
        # Generate data for each instrument
        for instrument in instruments:
            code = instrument.get("instrumentCode")
            weightage = instrument.get("weightage")
            
            # Generate instrument data
            instrument_data = self.generate_instrument_data(int(code), time_period)
            instrument_data["weightage"] = weightage
            
            updated_instruments[str(code)] = instrument_data
            
        return updated_instruments 