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
    },
 jats : {
      page: 'page-range',
      volume: 'biblScope unit="volume"',
      issue: 'biblScope unit="issue"',
      "publisher-place": 'pubPlace',
      DOI: 'idno type="doi"',
      URL: 'ptr type="web"',
}};

//match(/[a-zA-Z0-9_-]+/)[0]

if(annotated=="grobid"){
  output = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<tei xmlns="http://www.tei-c.org/ns/1.0" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:mml="http://www.w3.org/1998/Math/MathML">' +
    '<listBibl>';
  output += '</listBibl></tei></xml>'
}

if (process.argv[3]) {
  var fileName = './' + process.argv[3];
} else {
  throw new Error('file not specified, please add it in the first argument');
}
