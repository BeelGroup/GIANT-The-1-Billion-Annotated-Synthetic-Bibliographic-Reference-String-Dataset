from __future__ import (absolute_import, division, print_function,
                        unicode_literals)

# Import the citeproc-py classes we'll use below.
from citeproc import CitationStylesStyle, CitationStylesBibliography
from citeproc import Citation, CitationItem
from citeproc import formatter
from citeproc.source.json import CiteProcJSON


#import urllib3.request, json
from urllib.request import urlopen
import json
with urlopen("https://api.crossref.org/funders/100000015/works?query=global+state&filter=has-orcid:true&rows=20") as url:
	data = json.loads(url.read().decode())
	data = data["message"]["items"]
	for item in data:
		print(item["publisher"] + ":" + item["short-container-title"][0] + ":" + item["DOI"]) 
	bib_source = CiteProcJSON(json_data)


if __name__ == "__main__":
	print("main")
