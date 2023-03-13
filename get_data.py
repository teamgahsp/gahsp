import pandas as pd
from sodapy import Socrata

client = Socrata("data.montgomerycountymd.gov",
                 "qBrdfukFeTG5upnBLdCNnmuYb")

urls = {"mentalhealth":"r7cy-t8ms", 
            "weedpossessions":"8kxe-64dw", 
                "alcoholviolations":"heap-55cn",
                "dailyarrests":"xhwt-7h2h",
                "cpuprocessing":"sari-cs3z",
                "housingviolation":"usij-rq8e",
                "nonprimaryrestax":"5tdr-2y2r",
                "mcenrollment":"wmr2-6hn6",
                "publicelemschools":"j7rm-vyfs",
                "publichs":"7ycz-azby",
                "troubledproperties":"bw2r-araf",
                "hocoffices":"7nik-bq7n"}

for dataset, source in urls.items():
    results = client.get(source)
    results_df = pd.DataFrame.from_records(results)
    results_df.to_csv("./datasets/" + dataset + ".csv")

