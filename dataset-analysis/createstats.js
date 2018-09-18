var stats = true;
if(stats){
  stats = {
    types : {},
    author: {},
    authorfamily: {},
    authorgiven: {},
    authortotal: 0,
    authorunique: 0,
  };
}

  if(stats){
    if(!stats.types[line.type]){
      stats.types[line.type] = 0;
    }
    stats.types[line.type]++;
  }
  
  
   if(stats || true){
          stats.authortotal++;
          if(!stats.author[line.author[a].family+", "+line.author[a].given]){
            stats.author[line.author[a].family+", "+line.author[a].given] = 0;
          }
          stats.author[line.author[a].family+", "+line.author[a].given]++;
          
          if(!stats.authorfamily[line.author[a].family]){
            stats.authorfamily[line.author[a].family] = 0;
          }
          stats.authorfamily[line.author[a].family]++;
          
          if(!stats.authorgiven[line.author[a].given]){
            stats.authorgiven[line.author[a].given] = 0;
          }
          stats.authorgiven[line.author[a].given]++;
        }

if(stats){
 fs.writeFileSync("stats.js", JSON.stringify(stats));
  return;
}