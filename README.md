# CitationDataset

## Introduction
This script takes as input JSON files from CrossRef https://www.crossref.org/ and converts them to citeproc JSON. It then uses the following citeproc JS library https://github.com/Juris-M/citeproc-js to create citation strings in ~1500 CSL styles. Citation styles are available at https://github.com/citation-style-language/styles. The final output is tagged XML citations in a CSV file.

## Requirements

 💻Terminal (preferably 🐧Linux)

1. Install nodejs

`curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash`

`sudo apt-get install -y nodejs`

2. Node Modules

Citeproc and citeproc-js-node are required for this script. Working versions of these libraries are contained in this repo under /dataset-creation/node_modules. It is recommended to use these versions.

The folder /node_modules containing citeproc and citeproc-js-node must be placed under home directory if not already present there.

3. Required libraries

`cd node_modules`

- Install npmlog `npm install npmlog`
- Install xmldom `npm install xmldom`
- fs - for reading files
- zip and unzip (optional) `sudo apt install zip` `sudo apt install unzip`

## Input

This script takes as input JSON files from CrossRef https://www.crossref.org/. A script for downloading random CrossRef entries can be found in /dataset-creation/crossref/crossrefDownload.py. Alternatively a dump of CrossRef metadata (2017-04-02) is located at https://doi.org/b48h with additional details found https://github.com/greenelab/crossref.

Input files should be placed in the folder /dataset-creation/inputFiles/ . A sample is provided.

## Citation Styles

1568 CSL citation styles are located under dataset-creation/csl. Citation styles are obtained from https://github.com/citation-style-language/styles. A small number were removed as they were not working.


## Create Citation Dataset

Under the folder /dataset-creation run the following:

`node generateCSVcitationdataset.js tags [input_filename]`

Example:

`node generateCSVcitationdataset.js tags sampleCrossref.json`

This script will generate the CSV citation file and save it to /dataset-creation/outputFiles/ . The output file will be named 'output_[input_filename].csv'. It will also create cslciteproc.json under /dataset-creation/cslCiteprocOutput/

Optional:

If you have a large number of input files it may be better to run ./createCitations.sh under /dataset-creation. This script will loop through all input files located in /dataset-creation/inputFiles. For each file it will run generateCSVcitationdataset. Each output file will then be zipped and saved in /dataset-creation/outputFiles. The unzipped version will be removed.

## Output

The output will be a CSV file with the following columns:
- doi
- articleType (journal, book etc.)
- citationStyle
- citationStringAnnotated

articleType and citationStyle are indexes and the appropriate index file is located under /dataset-creation/indexes/ . citationStringAnnotated is an annotated XML citation. A sample output file is given in outputFiles/output_sampleCrossref.csv. Any errors, such as a citation style which didn't work, are logged to log.txt.

## License

MIT License

## Main Authors and Contributors 

- Mark Grennan grennama (@) tcd.ie
- Joeran Beel beelj (@) tcd.ie.
- Martin Schibel
- Andrew Collins
- Dominika Tkaczyk


