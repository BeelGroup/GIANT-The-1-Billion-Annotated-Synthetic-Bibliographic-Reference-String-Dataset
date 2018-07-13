 //$url = "https://api.crossref.org/funders/100000015/works?query=global+state&filter=has-orcid:true&rows=20&mailto=nepalicoin@gmail.com";
    $url = "http://api.crossref.org/works?sample=25&select=DOI&mailto=nepalicoin@gmail.com";
    $data = json_decode(file_get_contents($url) ,true);
    if($data["status"]=="ok"){
      $data = $data["message"]["items"];
      $return = "";
      foreach($data as $item){
        $itembibtex = file_get_contents("http://api.crossref.org/works/".$item["DOI"]."/transform/application/x-bibtex");
        $return .= $itembibtex."\n";

      }
      file_put_contents("file.txt",$return);
      echo $return;
