import pandas as pd
from sodapy import Socrata

client = Socrata("data.montgomerycountymd.gov",
                 "qBrdfukFeTG5upnBLdCNnmuYb")

urls = ["7nik-bq7n", "bw2r-araf"]

for source in urls:
    results = client.get(source)
    results_df = pd.DataFrame.from_records(results)
    results_df.to_csv(source + ".csv");

