"""get random citeproc-json records from Crossref"""

from habanero import cn
from habanero import Crossref
import time

start = time.time()

cr = Crossref()
i = 0

while i < 6000:
    # get random dois (Max: 100)
    try:
        randomDois = cr.random_dois(100)
        time.sleep(0.5)  # to avoid rate limit
    except:
        print("Exception occured with random_dois on loop:", i)
        pass

    try:
        resultsCrossRefAPI = cn.content_negotiation(
            ids=randomDois, format="citeproc-json")

        # append to file
        with open('results.json', 'a+') as f:
            for item in resultsCrossRefAPI:
                f.write("%s\n" % item)

        print("Completed: ", i * 100)
    except:
        print("Exception occured with getting results on loop:", i)
        pass

    i += 1
    time.sleep(0.5)


end = time.time()
print("Time: ", end - start)
