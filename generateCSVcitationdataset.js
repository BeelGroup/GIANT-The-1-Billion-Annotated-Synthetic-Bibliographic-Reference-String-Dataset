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
//console.log(process.argv);
console.time("script");
if (process.argv[3]) {
  var fileName = './' + process.argv[3];
} else {
  var fileName = './cr20.json';
}
var fs = require('fs');
var citeproc = require("citeproc-js-node");
var xmldom = require('xmldom').DOMParser;

function csvline(fields) {
  var string = "";
  //console.log(fields);
  for (var i = 0; i < fields.length; i++) {
    string += '"' + fields[i].replace(/\n/g, '').replace(/\"/g, '""') + "\","; //
  }
  return string;
}
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};



console.time("readrawfile");
var data = fs.readFileSync(fileName, 'utf8');
console.timeEnd("readrawfile");

var lines = data.split('\n');
if (process.argv[4]) {
  // node --max-old-space-size=20000 generateCSVcitationdataset.js sdf cross_10k.json 0

  var treshhold = parseInt(process.argv[4]);
  var multiplier = 50;
  //treshhold = 0;
  lines = lines.slice(multiplier*treshhold,multiplier*(1+treshhold));
  console.log("Treshold" + treshhold+ " count "+lines.length+ "until"+(multiplier*(1+treshhold)-1));
}
fs.appendFileSync('log.txt', "Treshold" + treshhold+ " count\n");
var count = lines.length;
var citations = [];
var unknowns = [];
var emptyvalues = [" ","","null","NULL"," "];

for (var i = 0; i < lines.length; i++) {
  if (lines[i] === '') continue
  line = JSON.parse(lines[i]);
  if(line["type"]){
    line["type"] = line["type"].replace("journal-article", 'article-journal');
  }else{
    line["type"] = "undefinedtype";
  }
  citations[i] = {
    id: i,
    zotero2bibtexType : line["type"],
  };
  if(line["author"] != undefined){
  for(var a = 0; a < line["author"].length; a++){

    //delete affiliation if it's empty
    if(line["author"][a]["affiliation"].length == 0){
      delete line["author"][a]["affiliation"];
    }
    //delete author if it's empty
    console.log("index:"+emptyvalues.indexOf(line["author"][a]["family"]));
    if(emptyvalues.indexOf(line["author"][a]["family"]) !== -1 && emptyvalues.indexOf(line["author"][a]["given"]) !== -1){
      line["author"].remove(a);
    }
  }
  if(line["author"].length === 0){
    delete line["author"];
  }
  }

  for (var prop in line) {
    var newprop = prop.replace("short-title", 'shortTitle').replace("short-container-title", 'container-title-short');
    //console.log(newprop);
    if (fieldTypes.hasOwnProperty(newprop)) {
      var type = fieldTypes[newprop];
      if (typeof type == "object") {
        type = "string";
      }
      //console.log(typeof type);

      if (type == "string" && (typeof line[prop] == "string" || typeof line[prop] == "number")) {
        citations[i][newprop] = line[prop]
      } else if (type == "string" && line[prop] && typeof line[prop] == "object") { //
        if(line[prop].length > 0){
        citations[i][newprop] = line[prop][0]
      }
      } else if (type == DATE && typeof line[prop] == "object") {
        citations[i][newprop] = line[prop]
      } else if (type == NAME_LIST && typeof line[prop] == "object") {
        citations[i][newprop] = line[prop]
      } else {
        //console.log(line);
        console.log(";"+type + ";" + typeof line[prop] + ";" + newprop + ";" + line[prop]);
      }


      unknowns[newprop] = true;
    } else {
      unknowns[newprop] = "unknown";
    }
  }

  //

}
//console.log(citations);
console.log(unknowns);
var newFile = "./cslciteproc.json";
fs.writeFileSync(newFile, JSON.stringify(citations));

console.log('Saved JSON to ' + newFile);

//This folder should have all the CSL files
//csls = ["bibtex","modern-language-association","apa"];

const cslFolder = './csl/';
var files = fs.readdirSync(cslFolder);
var csls = [];
for (var i in files) {
  if ((files[i]+"").slice(-4) == ".csl") {
    csls.push(files[i].slice(0, -4));
  }
}

var output_file = "output/output_strings_" + (count-1) + "_rand"+ Math.floor(Math.random() * 1000) + ".csv";
var output = "";
//clear the file
fs.writeFileSync(output_file, "");
//Start creating the output file--
fs.appendFileSync('log.txt', "Writing file " + output_file+ "\n");

//var logger = fs.createWriteStream(output_file, { flags: 'a'})
var citation_keys = Object.keys(citations);
// https://groups.google.com/forum/#!topic/zotero-dev/2i_-1EZZbUU
//create bibtex bibliography
console.log("creating bibtex");
var sys = new citeproc.simpleSys();
var enUS = fs.readFileSync('./locales/locales-en-US.xml', 'utf8');
sys.addLocale('en-US', enUS);
var styleString = fs.readFileSync('bibtex.csl_', 'utf8').replace(/<sort>([\s\S]*?)<\/sort>/g, '');
var engine = sys.newEngine(styleString, 'en-US');
sys.items = citations;
engine.setOutputFormat("text");
engine.updateItems(citation_keys);
var bibtex = engine.makeBibliography();
bibtex = bibtex[1];
//bibtex done

//remove zotero2
for (var i = 0; i < citations.length; i++) {
delete citations[i]["zotero2bibtexType"];
}

//logger.write(csvline(["DOI", "type", "CitationType", "CitationString", "Json", "BibTex"])+ "\n");//.join(",")
fs.appendFileSync(output_file,csvline(["DOI", "type", "CitationType", "CitationString", "Json", "BibTex"]));


var failedbibliographies = [];

var grobid_replace = {
  page: 'biblScope unit="page"',
  volume: 'biblScope unit="volume"',
  issue: 'biblScope unit="issue"',
  "publisher-place": 'pubPlace',
  DOI: 'idno type="doi"',
  URL: 'ptr type="web"',
};
var jats_replace = {
  page: 'page-range',
  volume: 'biblScope unit="volume"',
  issue: 'biblScope unit="issue"',
  "publisher-place": 'pubPlace',
  DOI: 'idno type="doi"',
  URL: 'ptr type="web"',
};
for (var i = 0, len = csls.length; i < len; i++) { //
  console.log(i + ". " + csls[i]);
  var styleString = fs.readFileSync(cslFolder + csls[i] + '.csl', 'utf8');
//fs.readFile(cslFolder + csls[i] + '.csl', 'utf8',function (err, styleString)  {
//  if (err) throw err;


 styleString = styleString.replace(/<([^>]*)(\sdefault-locale=\".+?\"(\s|))(.*?)>/, '<$1$3>');

 //text.push(doc.getElementsByTagName('names'));
 var variable;//
  if (process.argv[2] == "tags") {

    styleString = styleString.replace(/<name (.*?)\/>/g,'<name $1>\n<name-part name="family"/>\n<name-part name="given"/>\n</name>');


    var xml = new xmldom();
    var doc = xml.parseFromString(styleString, 'application/xml');
    var XMLSerializer = require('xmldom').XMLSerializer;
    var serializer = new XMLSerializer();

    for(var a=0;a<5;a++){
    var tagname = ["text","date","names","name-part","date-part"][a];
    var text = doc.getElementsByTagName(tagname);
    //console.log(tagname+":"+text.length);
    for (id in text) {
      //console.log(text[id]);
       try{
         //var attributename = tagname.slice(-5) == "-part" ? "name ": "variable";
         //console.log(attributename);
         if(tagname.slice(-5) == "-part"){
           variable = text[id].getAttribute("name");
         }else{
           variable = text[id].getAttribute("variable");
         }
      }catch(error){
        //console.log(text[id]);
        variable = null;}
        //console.log(variable);
      if(variable){//.replace("&","&amp;")
        text[id].setAttribute("prefix",(text[id].getAttribute("prefix").replace("&","&amp;"))+"<"+variable+">");
        text[id].setAttribute("suffix","</"+variable+">"+(text[id].getAttribute("suffix").replace("&","&amp;")));

        //console.log(text[id].getAttribute("prefix"));
   }}}
   styleString = serializer.serializeToString(doc);
//   console.log(styleString);
  // return;
   //return;
    //add name parts to <names /> if missingf

    //styleString = styleString.replace(/<name (.*?)\/>/g,'<name $1>\n<name-part name="family" prefix="&lt;surname&gt;" suffix="&lt;/surname&gt;"/>\n<name-part name="given"  prefix="&lt;given-names&gt;" suffix="&lt;given-names&gt;"/>\n</name>');

    //add given and family suffix
    //styleString = styleString.replace(/<name-part name="(.*?)"( prefix="([^"]*)")?( suffix="([^"]*)")?/g, '<name-part name="$1" prefix="$3&lt;$1&gt;" suffix="&lt;/$1&gt;$5"');

    //fucked             <text variable="DOI" form="long" prefix="DOI:"/> https://regexr.com/3tvbl
    //styleString = styleString.replace(/<text variable="(.*?)"( prefix="([^"]*)")?( suffix="([^"]*)")?/g, '<text variable="$1" prefix="$3&lt;$1&gt;" suffix="&lt;/$1&gt;$5"');
    //styleString = styleString.replace(/<date variable="(.*?)"( prefix="([^"]*)")?( suffix="([^"]*)")?/g, '<date variable="$1" prefix="$3&lt;$1&gt;" suffix="&lt;/$1&gt;$5"');
    //styleString = styleString.replace(/<names variable="(.*?)"( prefix="([^"]*)")?( suffix="([^"]*)")?/g, '<names variable="$1" prefix="$3&lt;$1&gt;" suffix="&lt;/$1&gt;$5"');


  }
  if (true || removesorting) {
    styleString = styleString.replace(/<sort>([\s\S]*?)<\/sort>/g, '');
    //layout , remove citation numbers
    //    styleString = styleString.replace(/<layout prefix=\"(.*?)\" suffix=\"(.*?)\"/g,'<layout');
    styleString = styleString.replace(/<text variable=\"citation-number\"(.*?)\/>/g, '');
    styleString = styleString.replace(/disambiguate-add-year-suffix=\"true\"/g, '');
  }
  if (false) {
    for (var j in grobid_replace) {
      styleString = styleString.replace(new RegExp('&lt;'+j+'&gt;','g'), '&lt;'+grobid_replace[j].replace(/\"/g,'&quot;')+'&gt;');
      styleString = styleString.replace(new RegExp('&lt;/'+j+'&gt;','g'), '&lt;/'+grobid_replace[j].match(/\w+/)[0]+'&gt;');
    }
  }
  //console.log(styleString);

  //console.log(styleString);return;
  //console.log("create_engine");

  try {
  var engine = sys.newEngine(styleString, 'en-US');
  //sys.items = citations;
  engine.setOutputFormat("text");
  engine.updateItems(citation_keys);
  var bib = engine.makeBibliography();
  bib = bib[1];
  if (bib != undefined) {
    for (var c = 0; c < bib.length; c++) {
      //console.log([citations[c]["DOI"], citations[c]["type"], csls[i], bib[c], JSON.stringify(citations[c]), bibtex[c].trim()]);
      //return;
      //return;
      //output += csvline([citations[c]["DOI"],citations[c]["type"],csls[i],bib[c]]);
      //logger.write(csvline([citations[c]["DOI"], citations[c]["type"], csls[i], bib[c], JSON.stringify(citations[c]), bibtex[c].trim()]) + "\n");
      // .replace(/<\/(.*?)><\1>/g,"")

      //The issue with two double issued tags
      csl[i] = csl[i].replace(/<\/issued>([^<]*)<issued>/g,"$1")
      fs.appendFileSync(output_file,csvline([citations[c]["DOI"], citations[c]["type"], csls[i]), bib[c], JSON.stringify(citations[c]), bibtex[c].trim()]) + "\n");
    }
  } else {
    failedbibliographies.push(i + ". " + csls[i]);
    console.log("undefined - couldnt create bibliography");
  }
}catch(error) {
  console.error(error);
  fs.appendFileSync('log.txt', 'Error with '+csls[i]+"\n"+error);
  // expected output: SyntaxError: unterminated string literal
  // Note - error messages will vary depending on browser
}


//return;

  //if(i==20){break;}
}
console.log("Failed ones:");
console.log(failedbibliographies.join("\n"));
console.log();
console.log('Saved CSV to ' + output_file);


/*
fs.writeFile(output_file, output, function(err) {
  if (err) return console.log(err);
  console.log('Saved CSV to ' + output_file);
});
*/
console.timeEnd("script");

output = '<?xml version="1.0" encoding="UTF-8"?>' +
  '<tei xmlns="http://www.tei-c.org/ns/1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:mml="http://www.w3.org/1998/Math/MathML">' +
  '<listBibl>';
