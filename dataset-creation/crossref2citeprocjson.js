module.exports = {
crossref2citeproc : function(lines){
	var fs = require('fs');

var field = require("./fieldTypes.js");
var unknowns = [];

var emptyvalues = [" ","","null","NULL"," "];
var skiptypes = ["component","book-issue","undefined"];
var citations = [];
var citationcounter = 0;

for (var i = 0; i < lines.length; i++) {
  if (lines[i] === '') continue;
  line = JSON.parse(lines[i]);
  if(line.type){
    line.type = line.type.replace("journal-article", 'article-journal').replace("book-chapter", 'chapter');
  }else{
    line.type = "undefined";
  }
  if(skiptypes.indexOf(line.type) !== -1){
    continue;
  }

  citations[citationcounter] = {
    id: citationcounter,
   // zotero2bibtexType : line["type"],//I know it looks strange but it's needed for the bibtex.csl
  };

  //delete empty authors
  if(line.author != undefined){
    for(var a = 0; a < line["author"].length; a++){

      //delete affiliation if it's empty
      if(line["author"][a]["affiliation"].length == 0){
        delete line["author"][a]["affiliation"];
      }
      //delete author if it's empty
      //console.log("index:"+emptyvalues.indexOf(line["author"][a]["family"]));
      if(emptyvalues.indexOf(line["author"][a]["family"]) !== -1 && emptyvalues.indexOf(line["author"][a]["given"]) !== -1){
        line["author"].remove(a);
      }
    }
    if(line["author"].length === 0){
      delete line["author"];
    }
  }

  //go through each property
  for (var prop in line) {
    var newprop = prop.replace("short-title", 'shortTitle').replace("short-container-title", 'container-title-short');
    //console.log(newprop);
    if (field.types.hasOwnProperty(newprop)) {
      var type = field.types[newprop];
      if (typeof type == "object") {
        type = "string";
      }
      if (type == "string" && (typeof line[prop] == "string" || typeof line[prop] == "number")) {
        citations[citationcounter][newprop] = line[prop]
      } else if (type == "string" && line[prop] && typeof line[prop] == "object") { //
        if(line[prop].length > 0){
        citations[citationcounter][newprop] = line[prop][0]
      }
      } else if (type == field.DATE && typeof line[prop] == "object") {
        citations[citationcounter][newprop] = line[prop]
      } else if (type == field.NAME_LIST && typeof line[prop] == "object") {
        citations[citationcounter][newprop] = line[prop]
      } else {
        console.log("Unknown format: "+ type + ";" + typeof line[prop] + ";" + newprop + ";" + line[prop]);
      }

      unknowns[newprop] = true;
    } else {
      unknowns[newprop] = "unknown";
    }
  }
  citationcounter++;
}

//console.log(unknowns);
var newFile = "./cslCiteprocOutput/cslciteproc.json";
fs.writeFileSync(newFile, JSON.stringify(citations));
console.log('Saved JSON to ' + newFile);
return citations;
}}
