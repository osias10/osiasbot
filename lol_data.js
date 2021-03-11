let http = require('http');
let express = require('express');


const cheerio = require("cheerio");

const request =require("request");
let app = express();
var server= http.createServer(app);

const urlencode= require('urlencode');




//const { resolve } = require('node:path');


let keys = require('./key.json');
const liot_api = keys.Riot_key;
const discord_key = keys.Discord_key;
const riot_tft_api = keys.Riot_tft_key;




module.exports = {

    lolid: function(nickname){
        let url="https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ urlencode(nickname) +"?api_key="+ liot_api;

        return new Promise(function(resolve, reject){

            request(url, function(error, response, body){
              let info_jason = JSON.parse(body);
              let key = Object.keys(info_jason);
            //  console.log(key);
        
              //let result = "id: "+info_jason[key]['id'] + "name: "+info_jason[key]["name"] +"summonerLevel :" + info_jason[key]["summonerLevel"];
              //let result = "id: "+info_jason[key]["id"] + "name: "+info_jason[key]["name"] +"summonerLevel :" + info_jason[key]["summonerLevel"];
              let result = "id: "+info_jason['id']+"\tLevel: "+info_jason['summonerLevel'];
              //console.log("info_jason: "+info_jason);
              //console.log("test");
              //console.log(result);
              console.log(info_jason);
              resolve(info_jason);
        
            })
          })

    },

    loltier: function(lolid){
        //let id=lolid['id'];
        let url="https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/"+lolid['id'] +"?api_key="+ liot_api;
        
        return new Promise(function(resolve, reject){
          //console.log(lolid);
          request(url, function(error, response, body){
            let info_tier = JSON.parse(body);
            let key = Object.keys(info_tier);
            console.log(lolid);
          //  console.log(key);
      
            //let result = "id: "+info_jason[key]['id'] + "name: "+info_jason[key]["name"] +"summonerLevel :" + info_jason[key]["summonerLevel"];
            //let result = "id: "+info_jason[key]["id"] + "name: "+info_jason[key]["name"] +"summonerLevel :" + info_jason[key]["summonerLevel"];
            //let result = "id: "+info_jason['id']+"\tLevel: "+info_jason['summonerLevel'];
            //console.log("info_jason: "+info_jason);
            //console.log("test");
            //console.log(result);
            console.log(info_tier);
            //console.log("console Tier: "+info_tier[0]['tier']);
            //result= lolid+info_tier;
            let result= info_tier;
            //console.log(result);
            
            resolve(result);
      
          })
        })
      
      
    },

    tftid: function(nickname){

        let url="https://kr.api.riotgames.com/tft/summoner/v1/summoners/by-name/"+ urlencode(nickname) +"?api_key="+ riot_tft_api;
      
        return new Promise(function(resolve, reject){
      
          request(url, function(error, response, body){
            let info_jason = JSON.parse(body);
            let key = Object.keys(info_jason);
          //  console.log(key);
      
            //let result = "id: "+info_jason[key]['id'] + "name: "+info_jason[key]["name"] +"summonerLevel :" + info_jason[key]["summonerLevel"];
            //let result = "id: "+info_jason[key]["id"] + "name: "+info_jason[key]["name"] +"summonerLevel :" + info_jason[key]["summonerLevel"];
            let result = "id: "+info_jason['id']+"\tLevel: "+info_jason['summonerLevel'];
            //console.log("info_jason: "+info_jason);
            //console.log("test");
            //console.log(result);
            console.log("tftid\n");
            console.log(info_jason);
            resolve(info_jason);
      
          })
        })
      
    },

    tfttier : function(id){
        let url="https://kr.api.riotgames.com/tft/league/v1/entries/by-summoner/"+id+"?api_key="+riot_tft_api;
        return new Promise(function(resolve, reject){
          request(url, function(error,response,body){
            let info_tfttier= JSON.parse(body);
            console.log(info_tfttier);
            resolve(info_tfttier);
          })
        })
    },

    get_lol_data : function(nickname){
    return Promise.all([loltier(lolid(nickname))]);
    },

    gettier : function(nickname){
        this.lolid(nickname).then(function(data){
            let summonerId=data['id'];
            console.log(data);

            loltier(summonerId).then(function(gettier){
                console.log(gettier);
                return(gettier);
            })
        })
    }

    

}
/*
function get_lol_data(nickname){
    return Promise.all([loltier(lolid(nickname))]);
}

console.log(Promise.all([loltier(lolid(nickname))]));

*/