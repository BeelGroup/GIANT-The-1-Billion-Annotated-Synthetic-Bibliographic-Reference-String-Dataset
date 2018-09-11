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

<iframe src='//charts.hohli.com/embed.html?created=1536665826809#w=800&h=600&d={"containerId":"chart","dataTable":{"cols":[{"label":"A","type":"string"},{"label":"B","type":"number"}],"rows":[{"c":[{"v":"article-journal"},{"v":7485}]},{"c":[{"v":"chapter"},{"v":1182}]},{"c":[{"v":"proceedings-article"},{"v":536}]},{"c":[{"v":"dataset"},{"v":169}]},{"c":[{"v":"report"},{"v":42}]},{"c":[{"v":"book"},{"v":56}]},{"c":[{"v":"monograph"},{"v":30}]},{"c":[{"v":"journal-issue"},{"v":57}]},{"c":[{"v":"dissertation"},{"v":16}]},{"c":[{"v":"other"},{"v":19}]},{"c":[{"v":"standard"},{"v":27}]},{"c":[{"v":"reference-entry"},{"v":62}]},{"c":[{"v":"reference-book"},{"v":1}]},{"c":[{"v":"proceedings"},{"v":1}]},{"c":[{"v":"posted-content"},{"v":1}]},{"c":[{"v":"book-section"},{"v":1}]},{"c":[{"v":"journal"},{"v":1}]}]},"options":{"width":800,"height":600,"legacyScatterChartLabels":true,"is3D":false,"pieHole":0.5,"booleanRole":"certainty","hAxis":{"useFormatFromData":true,"viewWindow":{"max":null,"min":null},"minValue":null,"maxValue":null},"vAxes":[{"title":null,"minValue":null,"maxValue":null,"viewWindow":{"max":null,"min":null},"useFormatFromData":true,"logScale":false},{"viewWindow":{"max":null,"min":null},"minValue":null,"maxValue":null,"useFormatFromData":true,"logScale":false}]},"state":{},"view":{"columns":null,"rows":null},"isDefaultVisualization":false,"chartType":"PieChart"}' frameborder='0' width='810' height='610'></iframe>

## License

MIT License
