const osmosis = require('osmosis');
const fs = require('fs');

const getPages = 3;      

let results = [];

for (let i = 0; i < getPages; i++) {
  startFrom = i*125;
  osmosis
    .get(`https://www.scalemates.com/search.php?q=*&sortby=date&page=news&fkSECTION[]=Kits&fkYEAR[]=2017&fkYEAR[]=2018&fkYEAR[]=2019&mode=ajax&start=${startFrom}&df=ok`)
    .find('.ac')
    .set({
      'scalematesUrl': '.ar > a@href',
      'brand': '.ar:html',
      'brandCatno': '.ar:html',
      'name': '.ar > a',
      'scale': '.ar:html',
      'description': '.ar > .nw:html',
      'boxartUrl': '.al > img@src',
      'year': '.ar > .nw:html',
    })
    .data(function(data) {

   


      // brand 
      data.brand = data.brand.split('<br>')[1];
      let brandCutTo = data.brand.search('1:');
      data.brand = data.brand.substring(0, brandCutTo - 1);

      // brand cat  
      data.brandCatno = data.brandCatno.split('<br>')[2];
      let brandCatnoCutTo = data.brandCatno.search(' <div');
      data.brandCatno = data.brandCatno.substring(0, brandCatnoCutTo - 2).replace('<span class="ut">','');
      data.brandCatno = data.brandCatno.replace('</span>',' ');

      // scale 
      data.scale = data.scale.split('<br>')[1];
      let scaleCutFrom = data.scale.search('1:');
      let scaleCutTo = data.scale.length;
      data.scale = data.scale.substring(scaleCutFrom, scaleCutTo).replace('1:','');

    
      //boxartUrl
      data.boxartUrl = data.boxartUrl.substring(0, data.boxartUrl.length - 9);
      
      // year
      data.year =  data.year.split(' |')[0].replace('*','');
      // descr 
      data.description = data.description.split('| ')[1];

      results.push(data);

     

      fs.writeFile("hh.json", JSON.stringify(results, null, 4), (err) => {
        if(err) {
          console.log(err);
        }
      })
    });
}