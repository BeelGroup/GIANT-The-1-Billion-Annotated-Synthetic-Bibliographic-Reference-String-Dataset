#Martin 16.7.2018
from __future__ import (absolute_import, division, print_function,
                        unicode_literals)

import argparse
#TODO:UnicodeDecodeError: 'ascii' codec can't decode byte 0xc3 in position 366
#TODO:json file too many backslashes
# construct the argument parse and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-l", "--limit", default=5,
	help="Limit")
ap.add_argument("-f", "--file", default="defaultsave.json",
	help="Specify the file you want to save it to")
ap.add_argument("-b", "--bibtexfile", default="citations.bibtex",
	help="Specify the file you want to save it to")
args = vars(ap.parse_args())


import json
from habanero import cn
from habanero import Crossref
#args(limit.name of the file)
#put it in a file
#1file.bibtex
#2file.json

cr = Crossref()
y = cr.works(select = ["DOI"],limit = args["limit"])
dois = []
for item in y["message"]["items"]:
        dois.append(item["DOI"])
print("Fetching DOIS:")
print(dois)
p = cn.content_negotiation(ids = dois, format = "bibtex")

with open(args["bibtexfile"], 'w') as f:
    for line in p:
        f.write(line.encode('utf-8')+"\n")
print("saved file:"+args["bibtexfile"])        

p = cn.content_negotiation(ids = dois, format = "citeproc-json")
        
#file = open(args["bibtexfile"], 'w')
##file.write(p)
#file.close()


with open(args["file"],"w") as f:
    json.dump(p,f)
f.close()
print("saved file:"+args["file"])  
print("Have a good day. Bye!")
