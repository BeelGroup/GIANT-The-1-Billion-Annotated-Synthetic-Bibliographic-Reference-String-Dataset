const fs = require('fs'); 
var parse = require('csv-parse/lib/sync');// npm install csv 

//const csv = require('csv-parser');
//var loader = require('csv-load-sync');
var replacetags = {
  //https://grobid.readthedocs.io/en/latest/training/Bibliographical-references/
  grobid : {
      
      author : 'author',
      title : 'title level="a"',
      issued : 'date',//date sequence
      page: 'biblScope unit="page"',
      volume: 'biblScope unit="volume"',
      issue: 'biblScope unit="issue"',
      "orgName" : 'orgName',// ?????
      publisher : 'publisher',
      "publisher-place": 'pubPlace',
      editor : 'editor',
      DOI: 'idno type="doi"',
      URL: 'ptr type="web"',
      "container-title" : 'title level="j"',//the journal in which the article is published
    },
 jats : {
      page: 'page-range',
      volume: 'biblScope unit="volume"',
      issue: 'biblScope unit="issue"',
      "publisher-place": 'pubPlace',
      DOI: 'idno type="doi"',
      URL: 'ptr type="web"',
}};

//match(/[a-zA-Z0-9_-]+/)[0] sdf
/*
//shuffel
sort -R onemillion.csv > onemillion_shuffeld.csv
head -n 1 onemillion.csv > 1m_shuffeld.csv && tail -n +2 onemillion.csv | sort -t "|" -k 1 >> 1m_shuffeld.csv

head -n10000 1m_shuffeld.csv > cit10k.csv

onemillion.csv

> java -Xmx1024m -jar grobid-trainer/build/libs/grobid-trainer-0.5.1-onejar.jar 1 citation -gH grobid-home


*/
if (process.argv[3]) {
  var fileName = process.argv[3];
} else {
  throw new Error('file not specified, please add it in the first argument');
}

if (process.argv[4]) {
  var outputFile = process.argv[4];
} else {
 //var outputFile = "../grobid-0.5.1/grobid-trainer/resources/dataset/citation10k/corpus/grobid.xml";//"xml/grobid.xml";
 throw new Error('output file not specified, please add it in the second argument');
}

if (process.argv[2]) {
  var annotated = process.argv[2];
} else {
  throw new Error('please specify output format from one of the following: '+Object.keys(replacetags).join(", "));
}

var output = "";
fs.writeFileSync(outputFile, "");
fs.appendFileSync(outputFile,'<?xml version="1.0" encoding="UTF-8"?>' +
    '<tei xmlns="http://www.tei-c.org/ns/1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:mml="http://www.w3.org/1998/Math/MathML">' +
    '<listBibl>');


const csv = require('csv-parser');

fs.createReadStream(fileName)
.pipe(csv())
.on('data', function(data){
    try {
      var output = data.annotated;
      for(var tag in replacetags[annotated]){
          output = output.replace(new RegExp("<"+tag+">","g"),"{{"+replacetags[annotated][tag]+"}}");
          output = output.replace(new RegExp("</"+tag+">","g"),"{{/"+replacetags[annotated][tag].match(/[a-zA-Z0-9_-]+/)[0]+"}}");
      }
      output = output.replace(/<\/?[^>]+(>|$)/g, "");
      output = output.replace(/{{(\/)?([^}]+)}}/g, "<$1$2>").replace(/&/g,"&amp;");
      fs.appendFileSync(outputFile,'<bibl>' + output + '</bibl>'+"\n");
    }
    catch(err) {
      throw new Error(err);
    }
})
.on('end',function(){
    fs.appendFileSync(outputFile,'</listBibl></tei>');
});  
