# citeproc-js

Fork of *citeproc-js* 

## Build

    ./tools/populate.sh

This will produce the top-level `citeproc.js` file.

    uglifyjs citeproc.js --compress --mangle --comments -o citeproc.min.js

This will produce the top-level `citeproc.min.js` file.


## Documentation

See `/manual/index.html` for comprehensive documentation.

## License

Common Public Attribution License (CPAL)

generatecsljson2.js
Run it "node generatecsljson2.js"
All CSL files must be in a directory called "csl/"

<!-- #######  YAY, I AM THE SOURCE EDITOR! #########-->
<h1 style="color: #5e9ca0;">Read Me</h1>
<h2 style="color: #2e6c80;">Requirements:</h2>
<p>Nodejs</p>
<h2 style="color: #2e6c80;">Used libraries:</h2>
<p><strong>"fs"</strong> for reading files<br />"<a href="https://www.npmjs.com/package/citeproc-js-node" target="_blank" rel="noopener"><strong>citeproc-js-node</strong></a>" - a wrapper for <a href="https://github.com/Juris-M/citeproc-js" target="_blank" rel="noopener">citeproc-js</a></p>
<h2 style="color: #2e6c80;">How to use the script:</h2>
<p>Open the Terminal and run:</p>
<p>node generateCSVcitationdataset.js</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
