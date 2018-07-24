//head -n1000 ~/Downloads/crossrefworks.json > cr1000.json

var fileName = './cr3.json';
var fs = require('fs');
var citeproc = require("citeproc-js-node");
function csvline(fields){
  var string = "";
  for (var i = 0; i < fields.length; i++) {
    string += '"'+fields[i].replace(/\n$/, '')+'",';//'"'+fields[i].replace(/[\\$'"]/g, "\\$&")+'",';
}
return string;
}

var data = fs.readFileSync(fileName, 'utf8');
var lines = data.split('\n');
var citations = [];
for (var i = 0; i < lines.length; i++) {
    if (lines[i] === '') continue
    line = JSON.parse(lines[i]);
    lines[i]=line;
    //console.log(line);
    citations[i] = {
	"id" : i,
	"title":"<title>"+line["title"][0]+"</title>",
	"type":line["type"],
	"publisher":line["publisher"],
	"issue":line["issue"],
	"URL":line["URL"],
	"author":[
    {
      "given": "Stephen C. W.",
      "family": "<family>Kong</fasdf>",
      "affiliation": []
    },
    {
      "given": "Heng",
      "family": "Li",
      "affiliation": []
    },
    {
      "given": "Chimay J.",
      "family": "Anumba",
      "affiliation": []
    }],//line["author"],
	"issued":{"date-parts":[[ 2005, 4, 12 ]]},//line["issued"],
	"page":line["page"],
  "DOI" : line["DOI"],
	};
//ls *.csl | xargs grep "default-locale" | sed -e "s/.*default-locale..//" | sed -e "s/\".*//" | sort | uniq -c | sort -n

//
//ls *.csl | xargs grep "csl\" version=
}


var newFile = "cslciteproc.json";
//console.log(citations);
fs.writeFile(newFile, JSON.stringify(citations), function (err) {
  if (err) return console.log(err);
  console.log('Saved JSON to ' + newFile);
});

var sys = new citeproc.simpleSys();
//Wherever your locale and style files are. None are included with the package.
var enUS = fs.readFileSync('./locales-en-US.xml', 'utf8');
//var enUS = fs.readFileSync('./locales-en-US.xml', 'utf8');

sys.addLocale('en-US', enUS);
const testFolder = './csl/';
//const testFolder = 'citeproc-js/docs/_static/data/styles/';
//http://citeproc-js.readthedocs.io/en/latest/testing.html
var files = fs.readdirSync(testFolder);
var csls = [];
for (var i in files) {
  if(files[i].slice(-4) == ".csl"){
    csls.push(files[i].slice(0,-4));
  }
}
//console.lo
//csls = ["bibtex","modern-language-association","apa"];
var output = "";
fs.writeFileSync("output_strings.csv", "");
var logger = fs.createWriteStream("output_strings.csv", {
flags: 'a' // 'a' means appending (old data will be preserved)
})
for (var i = 0, len = csls.length; i < len; i++) {//
  console.log(i+". "+csls[i]);


  var styleString = fs.readFileSync(testFolder+csls[i]+'.csl', 'utf8').replace(/<([^>]*)(\sdefault-locale=\".+?\"(\s|))(.*?)>/,'<$1$3>');
  //console.log(styleString);
  var engine = sys.newEngine(styleString, 'en-US');
  sys.items = citations;
  engine.setOutputFormat("text");

  engine.updateItems(Object.keys(citations));
  var bib = engine.makeBibliography();
  bib = bib[1];
  if(bib != undefined){
  for (var c = 0;c < bib.length; c++) {

    //console.log(csvline([citations[c]["DOI"],citations[c]["type"],csls[i],bib[c]]));
    //output += csvline([citations[c]["DOI"],citations[c]["type"],csls[i],bib[c]]);
    logger.write(csvline([citations[c]["DOI"],citations[c]["type"],csls[i],bib[c],JSON.stringify(citations[c])])+"\n");
  }
}else {
  console.log("undefined");
}

}

//JSON.stringify(bib[1])
return;
fs.writeFile("output_strings.csv", output, function (err) {
  if (err) return console.log(err);
  console.log("Saved CSV");
});


/*




var c = new citeproc.default.Engine({
   retrieveLocale: function (lang){
       return fs.readFileSync('locales-' + lang + '.xml' ,'utf8');
   },
   retrieveItem: function(id){
       return citations[id];
   }
},
 function(){
   return fs.readFileSync('chicago-fullnote-bibliography.csl');
 });

citeproc.previewCitationCluster({
  citationItems: citations.map(function (id) {
    return {
      id: id
    };
  }),
  properties: {
    noteIndex: 0
  }
}, [], [], "text");

/*
const testFolder = './cslstyles/';
var template;
var files = fs.readdirSync(testFolder);
var csls = [];
var cslname;
for (var i in files) {
  cslname = files[i];
  if(cslname.slice(-4) == ".csl"){
    template = fs.readFileSync(testFolder+files[i], 'utf8');
    csls[i] = template;
    //config.templates.add(cslname, template)
  console.log('Model Loaded: ' + cslname);
  }
}
fs.writeFileSync("allcsl.json", JSON.stringify(csls));
console.log('file saved');



var example = new Cite(citations)
//var ex = Cite.parseDoiJson(lines);

//doi/object
var output = example.format('bibliography', {
  format: 'text',
  template: 10,
  lang: 'en-US'
})

console.log(output)
*/

/*
var citeproc = CSL.Engine({
    retrieveLocale: function (lang){
        return fs.readFileSync('locales-' + lang + '.xml' ,'utf8');
    },
    retrieveItem: function(id){
        return citations[id];
    }
},
  function(){
    return fs.readFileSync('chicago-fullnote-bibliography.csl');
  });

*/

/*
renderBib();

citeprocSys = {
    // Given a language tag in RFC-4646 form, this method retrieves the
    // locale definition file.  This method must return a valid *serialized*
    // CSL locale. (In other words, an blob of XML as an unparsed string.  The
    // processor will fail on a native XML object or buffer).
    retrieveLocale: function (lang){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'locales-' + lang + '.xml', false);
        xhr.send(null);
        return xhr.responseText;
    },

    // Given an identifier, this retrieves one citation item.  This method
    // must return a valid CSL-JSON object.
    retrieveItem: function(id){
        return citations[id];
    }
};

// Given the identifier of a CSL style, this function instantiates a CSL.Engine
// object that can render citations in that style.
function getProcessor(styleID) {
    // Get the CSL style as a serialized string of XML
    var xhr = new XMLHttpRequest();
    xhr.open('GET', styleID + '.csl', false);
    xhr.send(null);
    var styleAsText = xhr.responseText;

    // Instantiate and return the engine
    var citeproc = new CSL.Engine(citeprocSys, styleAsText);
    return citeproc;
};


// This runs at document ready, and renders the bibliography
function renderBib() {
    var bibDivs = ["chicago-fullnote-bibliography"];
    for (var i = 0, ilen = bibDivs.length; i < ilen; ++i) {
        var bibDiv = bibDivs[i];
        var citeproc = getProcessor(bibDiv[i]);
        var itemIDs = [];
        for (var key in citations) {
            itemIDs.push(key);
        }
        citeproc.updateItems(itemIDs);
        var bibResult = citeproc.makeBibliography();
	console.log(bibResult);
        bibDiv.innerHTML = bibResult[1].join('\n');
    }
}




fs.writeFile(fileName, JSON.stringify(file), function (err) {
  if (err) return console.log(err);
  console.log(JSON.stringify(file));
  console.log('writing to ' + fileName);
});
"id": "Item-1",
    "type": "journal-article",
    "title": "Digital Typography",
    "publisher": "Center for the Study of Language and Information",
    "number-of-pages": "685",
    "source": "Amazon.com",
    "ISBN": "1575860104",
    "issue": "4",
    "URL": "http://dx.doi.org/10.1001/.387",
    "author": [
      {
        "family": "Knuth",
        "given": "Donald E."
      }
    ],
    "issued": {
       "date-parts": [
        [
          2006,
          2,
          27
        ]
      ]

*/
