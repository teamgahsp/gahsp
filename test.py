#API access endpoint: https://data.montgomerycountymd.gov/resource/icn6-v9z3.json
#
#!/usr/bin/env python

# make sure to install these packages before running:
# pip install pandas
# pip install sodapy

import pandas as pd
from sodapy import Socrata
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

date = (datetime.date.today() - datetime.timedelta(days=15)).strftime("%Y-%m-%d")
# today = pd.Timestamp("today").strftime("%Y-%m-%d").replace("-", "")
results_df = results_df[results_df['start_date'] >= date]

results_df.to_csv('data.csv')

