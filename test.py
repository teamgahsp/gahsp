#API access endpoint: https://data.montgomerycountymd.gov/resource/icn6-v9z3.json
#
#!/usr/bin/env python

# make sure to install these packages before running:
# pip install pandas
# pip install sodapy

import pandas as pd
from sodapy import Socrata

# Unauthenticated client only works with public data sets. Note 'None'
# in place of application token, and no username or password:
# client = Socrata("data.montgomerycountymd.gov", None)

# Example authenticated client (needed for non-public datasets):
client = Socrata("data.montgomerycountymd.gov",
                 "qBrdfukFeTG5upnBLdCNnmuYb")

# First 2000 results, returned as JSON from API / converted to Python list of
# dictionaries by sodapy.
results = client.get("icn6-v9z3", limit=5)

# Convert to pandas DataFrame
results_df = pd.DataFrame.from_records(results)


results_df.to_csv('results.csv')