"""
Smart Fit Calculator
Calculates how well a product fits a user's body measurements
"""

class FitCalculator:
    def __init__(self):
        # Standard size measurements (in cm)
        self.size_chart = {
            'XS': {'chest': 80, 'waist': 64, 'hip': 88},
            'S': {'chest': 86, 'waist': 68, 'hip': 92},
            'M': {'chest': 92, 'waist': 74, 'hip': 98},
            'L': {'chest': 98, 'waist': 80, 'hip': 104},
            'XL': {'chest': 106, 'waist': 88, 'hip': 112},
            'XXL': {'chest': 114, 'waist': 96, 'hip': 120},
        }
    
    def calculate_fit_score(self, user_measurements, product_size, clothing_type='shirt'):
        """
        Calculate how well a product fits the user
        
        Returns:
            dict: {
                'fit_score': 0-100,
                'fit_level': 'PERFECT_FIT', 'GOOD_FIT', 'LOOSE_FIT', 'TIGHT_FIT',
                'chest_fit': percentage,
                'waist_fit': percentage,
                'hip_fit': percentage,
                'recommendation': text
            }
        """
        if product_size not in self.size_chart:
            return self._default_fit()
        
        product_measurements = self.size_chart[product_size]
        
        # Calculate fit for each measurement
        chest_diff = abs(user_measurements['chest_cm'] - product_measurements['chest'])
        waist_diff = abs(user_measurements['waist_cm'] - product_measurements['waist'])
        hip_diff = abs(user_measurements['hip_cm'] - product_measurements['hip'])
        
        # Calculate fit percentages (closer to 0 diff = better fit)
        chest_fit = max(0, 100 - (chest_diff * 5))  # 5% penalty per cm difference
        waist_fit = max(0, 100 - (waist_diff * 5))
        hip_fit = max(0, 100 - (hip_diff * 5))
        
        # Overall fit score (weighted average)
        if clothing_type == 'shirt':
            fit_score = (chest_fit * 0.5 + waist_fit * 0.3 + hip_fit * 0.2)
        elif clothing_type == 'pants':
            fit_score = (waist_fit * 0.5 + hip_fit * 0.4 + chest_fit * 0.1)
        else:
            fit_score = (chest_fit + waist_fit + hip_fit) / 3
        
        # Determine fit level
        if fit_score >= 90:
            fit_level = 'PERFECT_FIT'
            recommendation = 'This will fit you perfectly!'
        elif fit_score >= 75:
            fit_level = 'GOOD_FIT'
            recommendation = 'This should fit you well'
        elif fit_score >= 60:
            fit_level = 'LOOSE_FIT'
            recommendation = 'This might be slightly loose'
        else:
            fit_level = 'TIGHT_FIT'
            recommendation = 'This might be tight'
        
        return {
            'fit_score': round(fit_score, 1),
            'fit_level': fit_level,
            'chest_fit': round(chest_fit, 1),
            'waist_fit': round(waist_fit, 1),
            'hip_fit': round(hip_fit, 1),
            'recommendation': recommendation,
            'size_difference': {
                'chest': round(chest_diff, 1),
                'waist': round(waist_diff, 1),
                'hip': round(hip_diff, 1)
            }
        }
    
    def find_best_fitting_products(self, user_measurements, products):
        """
        Find products that fit the user best
        
        Returns:
            list: Products sorted by fit score with fit details
        """
        results = []
        
        for product in products:
            # Get recommended size for this user
            recommended_size = self._get_recommended_size(user_measurements)
            
            # Calculate fit score
            fit_details = self.calculate_fit_score(
                user_measurements, 
                recommended_size,
                product.get('category', 'shirt').lower()
            )
            
            results.append({
                'product': product,
                'recommended_size': recommended_size,
                'fit_details': fit_details
            })
        
        # Sort by fit score (best fit first)
        results.sort(key=lambda x: x['fit_details']['fit_score'], reverse=True)
        
        return results
    
    def _get_recommended_size(self, measurements):
        """Get recommended size based on measurements"""
        chest = measurements['chest_cm']
        
        if chest < 83:
            return 'XS'
        elif chest < 89:
            return 'S'
        elif chest < 95:
            return 'M'
        elif chest < 102:
            return 'L'
        elif chest < 110:
            return 'XL'
        else:
            return 'XXL'
    
    def _default_fit(self):
        return {
            'fit_score': 50,
            'fit_level': 'UNKNOWN',
            'chest_fit': 50,
            'waist_fit': 50,
            'hip_fit': 50,
            'recommendation': 'Size information not available'
        }


# Example usage
if __name__ == "__main__":
    calculator = FitCalculator()
    
    # User measurements
    user = {
        'chest_cm': 92,
        'waist_cm': 76,
        'hip_cm': 98
    }
    
    # Test fit for different sizes
    print("=== Fit Analysis ===")
    for size in ['S', 'M', 'L']:
        fit = calculator.calculate_fit_score(user, size, 'shirt')
        print(f"\nSize {size}:")
        print(f"  Fit Score: {fit['fit_score']}%")
        print(f"  Fit Level: {fit['fit_level']}")
        print(f"  Recommendation: {fit['recommendation']}")
        print(f"  Chest Fit: {fit['chest_fit']}%")
        print(f"  Waist Fit: {fit['waist_fit']}%")
        print(f"  Hip Fit: {fit['hip_fit']}%")
