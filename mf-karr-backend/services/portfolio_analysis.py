import numpy as np
from datetime import datetime, timedelta
from services.index_service import IndexService

class PortfolioAnalysis:
    def calculate_max_drawdown(self, nav_data):
        """Calculate maximum drawdown from NAV data"""
        if not nav_data or len(nav_data) == 0:
            return 0
            
        peak = nav_data[0]['nav']
        max_drawdown = 0
        
        for point in nav_data:
            current_value = point['nav']
            
            if current_value > peak:
                peak = current_value
            elif peak > 0:
                drawdown = ((peak - current_value) / peak) * 100
                if drawdown > max_drawdown:
                    max_drawdown = drawdown
                    
        return max_drawdown
    
    def calculate_sharpe_ratio(self, nav_data):
        """Calculate Sharpe ratio from NAV data"""
        if not nav_data or len(nav_data) < 2:
            return 0
            
        # Calculate daily returns
        returns = []
        for i in range(1, len(nav_data)):
            daily_return = (nav_data[i]['nav'] - nav_data[i-1]['nav']) / nav_data[i-1]['nav']
            returns.append(daily_return)
            
        # Calculate average return
        avg_return = sum(returns) / len(returns)
        
        # Calculate standard deviation
        variance = sum((r - avg_return) ** 2 for r in returns) / len(returns)
        std_dev = variance ** 0.5
        
        # Assume risk-free rate of 3% annually
        annual_risk_free_rate = 0.03
        period_risk_free_rate = annual_risk_free_rate / 252  # Assuming ~252 trading days
        
        # Calculate Sharpe ratio
        if std_dev == 0:
            return 0
            
        sharpe_ratio = (avg_return - period_risk_free_rate) / std_dev
        
        # Annualize the Sharpe ratio
        annualized_sharpe_ratio = sharpe_ratio * (252 ** 0.5)
        
        return annualized_sharpe_ratio
    
    def calculate_cagr(self, nav_data, time_period):
        """Calculate CAGR from NAV data"""
        if not nav_data or len(nav_data) == 0:
            return 0
            
        v_begin = nav_data[0]['nav']
        v_final = nav_data[-1]['nav']
        
        cagr = (pow(v_final / v_begin, 1 / time_period) - 1) * 100
        return round(cagr, 2)
    
    def generate_date_array(self, time_period):
        """Generate array of dates for the given time period"""
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        threshold_date = today.replace(year=today.year - time_period)
        
        date_array = []
        current_date = threshold_date
        
        while current_date <= today:
            date_array.append(current_date.replace(hour=5, minute=30))
            current_date += timedelta(days=1)
            
        return date_array
    
    def process_portfolio_data(self, instruments_data, time_period, initial_amount, investment_mode):
        """Process portfolio data and return chart data with metrics"""
        date_array = self.generate_date_array(time_period)
        
        # Initialize data map
        data_map = {date.strftime("%Y-%m-%d"): None for date in date_array}
        
        first_date = date_array[0]
        first_sip_date = first_date.day - 1
        
        # Process each instrument
        for instrument_key, instrument_data in instruments_data.items():
            weightage = instrument_data['weightage']
            nav_data = instrument_data['navData']
            
            # Convert nav_data to dictionary for easier lookup
            scheme_data = {}
            for data_point in nav_data:
                date_object = datetime.strptime(data_point['date'], "%a, %d %b %Y %H:%M:%S %Z")
                tempDate = date_object.strftime("%Y-%m-%d") + 'T00:00:00.000Z'
                scheme_data[tempDate] = data_point['nav']
            
            # Fill in missing dates (forward fill)
            for i, date in enumerate(date_array):
                date_str = date.strftime("%Y-%m-%d") + 'T00:00:00.000Z'
                if date_str not in scheme_data and i > 0:
                    prev_date = date_array[i-1].strftime("%Y-%m-%d") + 'T00:00:00.000Z'
                    if prev_date in scheme_data:
                        scheme_data[date_str] = scheme_data[prev_date]
            
            # Backward fill
            for i in range(len(date_array) - 1, -1, -1):
                date_str = date_array[i].strftime("%Y-%m-%d") + 'T00:00:00.000Z'
                if date_str not in scheme_data and i < len(date_array) - 1:
                    next_date = date_array[i+1].strftime("%Y-%m-%d") + 'T00:00:00.000Z'
                    if next_date in scheme_data:
                        scheme_data[date_str] = scheme_data[next_date]
            
                
            # Calculate SIP increments
            sip_increment = 0
            if len(nav_data) > 0:
                sip_increment = weightage / nav_data[0]['nav']
            
            # Apply SIP logic
            for date in date_array:
                date_str = date.strftime("%Y-%m-%d") + 'T00:00:00.000Z'
                if date.day == first_sip_date and investment_mode == "monthly-sip" and date_str in scheme_data:
                    sip_increment += weightage / scheme_data[date_str]
                
                if date_str in scheme_data:
                    scheme_data[date_str] *= sip_increment

            
            # Combine with overall portfolio data
            for date in date_array:
                date_str = date.strftime("%Y-%m-%d")
                temp_date = date_str + 'T00:00:00.000Z'
                if temp_date in scheme_data:
                    if data_map[date_str] is None:
                        data_map[date_str] = scheme_data[temp_date]
                    else:
                        data_map[date_str] += scheme_data[temp_date]
                else:
                    if data_map[date_str] is None:
                        data_map[date_str] = weightage
                    else:
                        data_map[date_str] += weightage

        # Format chart data
        chart_data = []
        for date_str, value in data_map.items():
            if value is not None:
                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                formatted_date = f"{self.month_mapping[date_obj.month-1]} {str(date_obj.year)[2:]}"
                
                chart_data.append({
                    "date": formatted_date,
                    "nav": round((value * initial_amount) / 100, 2)
                })
        
        # Calculate metrics
        max_drawdown = self.calculate_max_drawdown(chart_data)
        sharpe_ratio = self.calculate_sharpe_ratio(chart_data)
        
        initial_value = 100
        final_value = chart_data[-1]['nav'] if chart_data else 100
        
        return {
            "chartData": chart_data,
            "metrics": {
                "initialValue": initial_value,
                "finalValue": final_value,
                "maxDrawdown": round(max_drawdown, 2),
                "sharpeRatio": round(sharpe_ratio, 2),
                "gain": round(((final_value - initial_value) / 100) * 100, 2)
            }
        }
    
    @property
    def month_mapping(self):
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    def process_index_data(self, index_name, time_period, initial_amount, investment_mode):
        """Process index data and return chart data"""
        # Fetch index data from your existing API
        index_service = IndexService()
        index_data = index_service.getIndexInfo(index_name, time_period)
        
        # Convert to the format needed for processing
        navs_for_range = self.get_navs_for_range(index_data[index_name]['indexData'], time_period)
        
        # Generate date array
        date_array = self.generate_date_array(time_period)
        
        # Initialize data map
        data_map = {date.strftime("%Y-%m-%d"): None for date in date_array}
        
        first_date = date_array[0]
        first_sip_date = first_date.day - 1
        
        # Convert nav_data to dictionary for easier lookup
        scheme_data = {}
        for data_point in navs_for_range:
            scheme_data[data_point['date']] = data_point['nav']
        
        # Fill in missing dates (forward and backward fill)
        for i, date in enumerate(date_array):
            date_str = date.strftime("%Y-%m-%d")
            if date_str not in scheme_data and i > 0:
                prev_date = date_array[i-1].strftime("%Y-%m-%d")
                if prev_date in scheme_data:
                    scheme_data[date_str] = scheme_data[prev_date]
        
        for i in range(len(date_array) - 1, -1, -1):
            date_str = date_array[i].strftime("%Y-%m-%d")
            if date_str not in scheme_data and i < len(date_array) - 1:
                next_date = date_array[i+1].strftime("%Y-%m-%d")
                if next_date in scheme_data:
                    scheme_data[date_str] = scheme_data[next_date]
        
        # Calculate SIP increments
        sip_increment = 1
        if len(navs_for_range) > 0:
            sip_increment = 100 / navs_for_range[0]['nav']
        
        # Apply SIP logic
        for date in date_array:
            date_str = date.strftime("%Y-%m-%d")
            if date.day == first_sip_date and investment_mode == "monthly-sip" and date_str in scheme_data:
                sip_increment += 100 / scheme_data[date_str]
            
            if date_str in scheme_data:
                scheme_data[date_str] *= sip_increment
        
        # Format chart data
        chart_data = []
        for date_str in sorted(data_map.keys()):
            if date_str in scheme_data:
                date_obj = datetime.strptime(date_str, "%Y-%m-%d")
                formatted_date = f"{self.month_mapping[date_obj.month-1]} {str(date_obj.year)[2:]}"
                
                chart_data.append({
                    "date": formatted_date,
                    "nav": round((scheme_data[date_str] * initial_amount) / 100, 2)
                })
        
        return {
            "chartData": chart_data
        }

    def fetch_index_data(self, index_name, time_period):
        """Fetch index data from API"""
        # This should use your existing index data fetching logic
        # For now, I'll assume you have a function that does this
        # Replace with your actual implementation
        
        # Example implementation:
        import requests
        
        response = requests.post(
            "http://your-api-url/api/index",
            json={
                "indexCode": index_name,
                "timePeriod": time_period
            }
        )
        
        return response.json()

    def get_navs_for_range(self, index_data, time_period):
        """Convert index data to NAV format"""
        if not index_data or len(index_data) == 0:
            return []
        
        first_val = float(index_data[0][1])
        converted_data = []
        
        for idx in range(len(index_data) - 1, -1, -1):
            nav = float(index_data[idx][1])
            date = index_data[idx][0]
            
            converted_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "nav": (nav * 100) / first_val
            })
        
        converted_data.reverse()
        return converted_data 