import requests
import pandas as pd

API_KEY = 'AIzaSyDrGu2gZ1HQ0r1Z930POH1Hi9O6ZctuVd4'

# def reverse_geocode(file):


url = 'https://maps.googleapis.com/maps/api/geocode/json?'

latlng = '40.714224,-73.961452'

params = {
    'key': API_KEY,
    'latlng': latlng
}

results = requests.get(url, params=params)
results = results.json()['results']

components = {
    'latitude': [],
    'longitude': [],
    'postal_code': [],
    'formatted_address': []
}

for address in results:
    lat = address['geometry']['location']['lat']
    lng = address['geometry']['location']['lng']
    address_components = address['address_components']
    postal_code = address_components[len(address_components) - 1]['long_name']
    formatted_address = address['formatted_address']
    
    components['latitude'].append(lat)
    components['longitude'].append(lng)
    components['postal_code'].append(postal_code)
    components['formatted_address'].append(formatted_address)

addresses = pd.DataFrame(components)
addresses.to_csv("coords_to_addr.csv")

# import googlemaps
# import pandas as pd
# gmaps = googlemaps.Client(key='AIzaSyDrGu2gZ1HQ0r1Z930POH1Hi9O6ZctuVd4')

# # Look up an address with reverse geocoding
# reverse_geocode_result = gmaps.reverse_geocode((39.15, -77.2))
# # res = pd.DataFrame(reverse_geocode_result)
# # res['postal_code']

# f = open("addresses.py", "w")
# f.write(str(reverse_geocode_result))
# f.close()