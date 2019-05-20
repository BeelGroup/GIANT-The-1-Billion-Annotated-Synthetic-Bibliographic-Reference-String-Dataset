const fs = require('fs');
var parse = require('csv-parse/lib/sync');// npm install csv

// articleType index
var journalIndex = [3, 22, 37, 46, 52];
var seriesIndex = [48, 49, 53];
var articleChapterIndex = [0, 1, 2, 43];

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
      "editor translator" : 'editor',
      editor: 'editor',
      DOI: 'idno type="doi"',
      URL: 'ptr type="web"',
    },
    cora : {
      author : 'author',
      title : 'title level="a"',
      journal : 'title level="j"',
      volume : 'biblScope unit="volume"',
      pages : 'biblScope unit="page"',
      address : 'pubPlace',
      booktitle : 'title level="m"',
      date : 'date',
      publisher : 'publisher',
      editor : 'editor',
      institution : 'institution',
      note : 'note',
      year : 'date'
    },
 jats : {
      page: 'page-range',
      volume: 'biblScope unit="volume"',
      issue: 'biblScope unit="issue"',
      "publisher-place": 'pubPlace',
      DOI: 'idno type="doi"',
      URL: 'ptr type="web"',
}};


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
  var citationStringAnnotated = process.argv[2];
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
      var output = data.citationStringAnnotated;

      for(var tag in replacetags[citationStringAnnotated]){
          output = output.replace(new RegExp("<"+tag+">","g"),"{{"+replacetags[citationStringAnnotated][tag]+"}}");
          output = output.replace(new RegExp("</"+tag+">","g"),"{{/"+replacetags[citationStringAnnotated][tag].match(/[a-zA-Z0-9_-]+/)[0]+"}}");
      }

      if (process.argv[2] === 'grobid'){
        var articleType = parseInt(data.articleType);

        if (journalIndex.includes(articleType)) {
          output = output.replace("<container-title>", '{{title level="j"}}');
          output = output.replace("</container-title>", '{{/title}}');
        }
        else if (seriesIndex.includes(articleType)) {
          output = output.replace("<container-title>", '{{title level="s"}}');
          output = output.replace("</container-title>", '{{/title}}');
        }
        else if (articleChapterIndex.includes(articleType)) {
          output = output.replace("<container-title>", '{{title level="a"}}');
          output = output.replace("</container-title>", '{{/title}}');
        }
        else { // books and other types
          output = output.replace("<container-title>", '{{title level="m"}}');
          output = output.replace("</container-title>", '{{/title}}');
        }
      }

      // to do: remove brackets if present in date

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
