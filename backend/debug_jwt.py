# simple_jwt_test.py - Simple test to debug JWT issues
"""
Simple test script to identify JWT issues.
Run this after starting your Flask app.
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:5500/api"
TEST_EMAIL = "user@example.com"
TEST_PASSWORD = "user123"

def test_jwt_flow():
    """Test the complete JWT authentication flow."""
    print("Testing JWT Authentication Flow")
    print("=" * 50)
    
    # Step 1: Login
    print("1. Attempting login...")
    login_data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Login Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('access_token')
            print(f"Token received: {token[:50] if token else 'None'}...")
            print(f"User ID: {data.get('user', {}).get('id')}")
        else:
            print(f"Login failed: {response.text}")
            return
            
    except Exception as e:
        print(f"Login error: {e}")
        return
    
    # Step 2: Test protected endpoint
    print("\n2. Testing protected endpoint (/auth/me)...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        print(f"Auth Me Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✓ Token validation successful")
            user_data = response.json()
            print(f"User: {user_data.get('email')}")
        else:
            print(f"✗ Token validation failed: {response.text}")
            return
            
    except Exception as e:
        print(f"Auth me error: {e}")
        return
    
    # Step 3: Test reservation endpoint
    print("\n3. Testing reservation endpoint...")
    
    # First get an event ID
    try:
        events_response = requests.get(f"{BASE_URL}/events")
        if events_response.status_code == 200:
            events = events_response.json().get('events', [])
            if events:
                event_id = events[0]['id']
                print(f"Using event ID: {event_id}")
            else:
                print("No events found")
                return
        else:
            print(f"Failed to get events: {events_response.text}")
            return
    except Exception as e:
        print(f"Events error: {e}")
        return
    
    # Try to create reservation
    reservation_data = {
        "event_id": event_id,
        "ticket_quantity": 1
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/reservations", 
            json=reservation_data, 
            headers=headers
        )
        print(f"Reservation Status: {response.status_code}")
        
        if response.status_code == 201:
            print("✓ Reservation created successfully")
        else:
            print(f"✗ Reservation failed: {response.text}")
            
            # Additional debugging for 422 errors
            if response.status_code == 422:
                print("\nDEBUG INFO for 422 error:")
                print(f"Request headers: {dict(headers)}")
                print(f"Request body: {json.dumps(reservation_data)}")
                print(f"Response headers: {dict(response.headers)}")
                
    except Exception as e:
        print(f"Reservation error: {e}")
    
    # Step 4: Test debug endpoint
    print("\n4. Testing debug endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/auth/debug/token", headers=headers)
        print(f"Debug Status: {response.status_code}")
        
        if response.status_code == 200:
            debug_data = response.json()
            print(f"Debug info: {json.dumps(debug_data, indent=2)}")
        else:
            print(f"Debug failed: {response.text}")
            
    except Exception as e:
        print(f"Debug error: {e}")

if __name__ == "__main__":
    test_jwt_flow()