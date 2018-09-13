# CitationDataset

## Requirements
 
 nodejs
 Linux Terminal

## Used libraries
<p><strong>"fs"</strong> for reading files<br />"<a href="https://www.npmjs.com/package/citeproc-js-node" target="_blank" rel="noopener"><strong>citeproc-js-node</strong></a>" - a wrapper for <a href="https://github.com/Juris-M/citeproc-js" target="_blank" rel="noopener">citeproc-js</a></p>
xmldom

## Build

Open the Terminal and run:

    node generateCSVcitationdataset.js

Or specify the file name

    node generateCSVcitationdataset.js notags cr20.json
    node generateCSVcitationdataset.js tags cr20.json

 
This script will generate `cslciteproc.json` and `output_strings.csv` file

## Documentation

To be extended

## Stats
 types

https://docs.google.com/spreadsheets/d/e/2PACX-1vQ38jcvyj96lo1aGAtQeTY52HfdLqA6R15ngrzgpnUF0fR19mv8mQnNfsj9jj-vm_AbdtvmC9ZcgdtZ/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false

## License

MIT License
