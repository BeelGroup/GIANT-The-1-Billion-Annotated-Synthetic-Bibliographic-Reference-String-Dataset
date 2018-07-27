//head -n1000 ~/Downloads/crossrefworks.json > cr1000.json
var NAME = 1;
var NAME_LIST = 2;
var DATE = 3;
var fieldTypes = {
  author: NAME_LIST,
  'collection-editor': NAME_LIST,
  composer: NAME_LIST,
  'container-author': NAME_LIST,
  editor: NAME_LIST,
  'editorial-director': NAME_LIST,
  director: NAME_LIST,
  interviewer: NAME_LIST,
  illustrator: NAME_LIST,
  'original-author': NAME_LIST,
  'reviewed-author': NAME_LIST,
  recipient: NAME_LIST,
  translator: NAME_LIST,
  accessed: DATE,
  container: DATE,
  'event-date': DATE,
  issued: DATE,
  'original-date': DATE,
  submitted: DATE,
  categories: 'object',
  id: ['string', 'number'],
  type: 'string',
  language: 'string',
  journalAbbreviation: 'string',
  shortTitle: 'string',
  abstract: 'string',
  annote: 'string',
  archive: 'string',
  archive_location: 'string',
  'archive-place': 'string',
  authority: 'string',
  'call-number': 'string',
  'chapter-number': 'string',
  'citation-number': 'string',
  'citation-label': 'string',
  'collection-number': 'string',
  'collection-title': 'string',
  'container-title': 'string',
  'container-title-short': 'string',
  dimensions: 'string',
  DOI: 'string',
  edition: ['string', 'number'],
  event: 'string',
  'event-place': 'string',
  'first-reference-note-number': 'string',
  genre: 'string',
  ISBN: 'string',
  ISSN: 'string',
  issue: ['string', 'number'],
  jurisdiction: 'string',
  keyword: 'string',
  locator: 'string',
  medium: 'string',
  note: 'string',
  number: ['string', 'number'],
  'number-of-pages': 'string',
  'number-of-volumes': ['string', 'number'],
  'original-publisher': 'string',
  'original-publisher-place': 'string',
  'original-title': 'string',
  page: 'string',
  'page-first': 'string',
  PMCID: 'string',
  PMID: 'string',
  publisher: 'string',
  'publisher-place': 'string',
  references: 'string',
  'reviewed-title': 'string',
  scale: 'string',
  section: 'string',
  source: 'string',
  status: 'string',
  title: 'string',
  'title-short': 'string',
  URL: 'string',
  version: 'string',
  volume: ['string', 'number'],
  'year-suffix': 'string'
};
//console.log(JSON.stringify(fieldTypes));
var fileName = './cr1000.json';
var fs = require('fs');
var citeproc = require("citeproc-js-node");
function csvline(fields){
  var string = "";
  for (var i = 0; i < fields.length; i++) {
    string += '"'+fields[i].replace(/\n$/, '')+"\";";//  .replace(/[\""]/g, '\\"')
}
return string;
}

var data = fs.readFileSync(fileName, 'utf8');
var lines = data.split('\n');

var citations = [];
for (var i = 0; i < lines.length; i++) {
    if (lines[i] === '') continue
    line = JSON.parse(lines[i]);
    //lines[i]=line;
    //console.log(line);
    citations[i] = {id:i}
    for(var prop in line) {
        var newprop = prop.replace("short-title", 'shortTitle').replace("short-container-title", 'container-title-short');
        //console.log(newprop);
        if(fieldTypes.hasOwnProperty(newprop)){
            var type = fieldTypes[newprop];
            if(typeof type == "object"){type = "stringORnumber";}
            //console.log(typeof type);

            if(type == "string" && (typeof line[prop] == "string" || typeof line[prop] == "number") ){
              citations[i][newprop] = line[prop]
            }else if(type == "stringORnumber" && (typeof line[prop] == "string" || typeof line[prop] == "number")){
              citations[i][newprop] == line[prop]
            }else if(type == "string" && typeof line[prop] == "object"  ){//&& line[prop].length
              citations[i][newprop] = line[prop][0]
            }else if(type == DATE && typeof line[prop] == "object"){
              citations[i][newprop] = line[prop]
            }else if(type == NAME_LIST && typeof line[prop] == "object"){
              citations[i][newprop] = line[prop]
            }else{
              console.log(type+";"+ typeof line[prop]+";"+newprop+";"+line[prop]);

            }
        }else{
          console.log("notfound:"+newprop);
        }
    }
    //

}
console.log(citations);
//return;
//
var newFile = "./cslciteproc.json";
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
const cslFolder = './csl/';
//const testFolder = 'citeproc-js/docs/_static/data/styles/';
//http://citeproc-js.readthedocs.io/en/latest/testing.html
var files = fs.readdirSync(cslFolder);
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

var styleString = fs.readFileSync(cslFolder+'bibtex.csl', 'utf8');
var engine = sys.newEngine(styleString, 'en-US');
sys.items = citations;
engine.setOutputFormat("text");
engine.updateItems(Object.keys(citations));
var bibtex = engine.makeBibliography();
bibtex = bibtex[1];

//console.log(bibtex);
//return;
logger.write("DOI;type;CitationType;CitationString;Json;BibTex\n");
for (var i = 0, len = csls.length; i < len; i++) {//
  console.log(i+". "+csls[i]);


  var styleString = fs.readFileSync(cslFolder+csls[i]+'.csl', 'utf8').replace(/<([^>]*)(\sdefault-locale=\".+?\"(\s|))(.*?)>/,'<$1$3>');
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
    logger.write(csvline([citations[c]["DOI"],citations[c]["type"],csls[i],bib[c],JSON.stringify(citations[c]),bibtex[c]])+"\n");
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

//ls *.csl | xargs grep "default-locale" | sed -e "s/.*default-locale..//" | sed -e "s/\".*//" | sort | uniq -c | sort -n

/*



    citations[i] = {
	"id" : i,                  //Required. The id field is a simple field containing any string or numeric value
	"title":line["title"][0],
  "shortTitle":line["short-title"][0],
	"type":line["type"],       //Required. The type field is a simple field containing a string value
	"publisher":line["publisher"],
	"issue":line["issue"],
	"URL":line["URL"],
	"author":line["author"],
	"issued":line["issued"],
	"page":line["page"],
  "DOI" : line["DOI"],
	};


//ls *.csl | xargs grep "csl\" version=


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
