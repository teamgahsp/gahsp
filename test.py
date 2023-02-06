#API access endpoint: https://data.montgomerycountymd.gov/resource/icn6-v9z3.json
#
#!/usr/bin/env python

# make sure to install these packages before running:
# pip install pandas
# pip install sodapy

import pandas as pd
from sodapy import Socrata
from pandas_geojson import to_geojson, write_geojson
import googlemaps
#import gmplot
import datetime

# Unauthenticated client only works with public data sets. Note 'None'
# in place of application token, and no username or password:
# client = Socrata("data.montgomerycountymd.gov", None)

# Example authenticated client (needed for non-public datasets):
client = Socrata("data.montgomerycountymd.gov",
                 "qBrdfukFeTG5upnBLdCNnmuYb")

# Returned as JSON from API / converted to Python list of
# dictionaries by sodapy.
results = client.get("icn6-v9z3", limit = 2000, select = "start_date, crimename2, crimename3, latitude, longitude", order = "start_date DESC")

# Convert to pandas DataFrame
results_df = pd.DataFrame.from_records(results)

# Split the 'start_date' column into two: one for date, one for time
results_df.insert(1, "start_time", results_df['start_date'].astype(str).str[11:], True)
results_df['start_date'] = results_df['start_date'].astype(str).str[:10]

date = (datetime.date.today() - datetime.timedelta(days=1)).strftime("%Y-%m-%d")
# today = pd.Timestamp("today").strftime("%Y-%m-%d").replace("-", "")
results_df = results_df[results_df['start_date'] >= date]

geo_json = to_geojson(df=results_df, lat='latitude', lon='longitude', properties=['start_date', 'start_time', 'crimename2', 'crimename3'])
for feature in geo_json["features"]:
    for coord in range(0,2):
        feature["geometry"]["coordinates"][coord] = float(feature["geometry"]["coordinates"][coord])
f = open("data.js", "w")

f.write("eqfeed_callback(" + str(geo_json) + ");")
f.close()

# write_geojson(geo_json, filename='data.geojson', indent=4)





# Display data on Google Maps
gmaps = googlemaps.Client(key='AIzaSyDrGu2gZ1HQ0r1Z930POH1Hi9O6ZctuVd4')



# Testing out gmplot
#gmap = gmplot.GoogleMapPlotter(results_df.loc[1, 'latitude'], results_df.loc[1, 'longitude'], 10, apikey='AIzaSyDrGu2gZ1HQ0r1Z930POH1Hi9O6ZctuVd4')
#gmap = gmplot.GoogleMapPlotter(0, 0, 10, apikey='AIzaSyDrGu2gZ1HQ0r1Z930POH1Hi9O6ZctuVd4')
#gmap.draw('map.html')
