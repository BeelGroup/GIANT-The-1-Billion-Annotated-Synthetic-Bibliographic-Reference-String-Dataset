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
