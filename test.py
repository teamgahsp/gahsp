#API access endpoint: https://data.montgomerycountymd.gov/resource/icn6-v9z3.json
#
#!/usr/bin/env python

# make sure to install these packages before running:
# pip install pandas
# pip install sodapy

import pandas as pd
from sodapy import Socrata
from pandas_geojson import to_geojson
#import gmplot
import datetime

offenseB = "90" # Offense B codes start with 90. 
offenseAWeight = 2
offenseBWeight = 1

def categorize(row):
    if row['nibrs_code'][:2] == offenseB:
        return offenseBWeight
    return offenseAWeight

def assignWeights(df):
    df['weight'] = df.apply(lambda row: categorize(row), axis=1)
    return df

# Unauthenticated client only works with public data sets. Note 'None'
# in place of application token, and no username or password:
# client = Socrata("data.montgomerycountymd.gov", None)
# Example authenticated client (needed for non-public datasets):
client = Socrata("data.montgomerycountymd.gov",
                 "qBrdfukFeTG5upnBLdCNnmuYb")

# Returned as JSON from API / converted to Python list of
# dictionaries by sodapy.
results = client.get("icn6-v9z3", limit = 199, select = "nibrs_code, start_date, crimename2, crimename3, latitude, longitude, place", order = "start_date DESC")

# Convert to pandas DataFrame
results_df = pd.DataFrame.from_records(results)

# Split the 'start_date' column into two: one for date, one for time
results_df.insert(1, "start_time", results_df['start_date'].astype(str).str[11:], True)
results_df['start_date'] = results_df['start_date'].astype(str).str[:10]

# find today's date and collect crimes from days=x days ago to today.
date = (datetime.date.today() - datetime.timedelta(days=10)).strftime("%Y-%m-%d")
# today = pd.Timestamp("today").strftime("%Y-%m-%d").replace("-", "")
results_df = results_df[results_df['start_date'] >= date]

results_df = results_df.rename(columns={"crimename2":"NIBRS_CrimeName", "crimename3":"Offense_Name"})

results_df = assignWeights(results_df)

geo_json = to_geojson(df=results_df, lat='latitude', lon='longitude', properties=['start_date', 'start_time', 'NIBRS_CrimeName', 'Offense_Name', 'place', 'weight'])
for feature in geo_json["features"]:
    for coord in range(0,2):
        feature["geometry"]["coordinates"][coord] = float(feature["geometry"]["coordinates"][coord])

f = open("data.js", "w")
f.write("eqfeed_callback(" + str(geo_json) + ");")
f.close()


