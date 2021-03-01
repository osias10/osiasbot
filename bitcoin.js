let http = require('http');
let express = require('express');


const cheerio = require("cheerio");

const request =require("request");
let app = express();
var server= http.createServer(app);


const getUpbit=function(coin){

    //let url=""+ urlencode(nickname) +"?api_key="+ liot_api;
    let url="https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.KRW-"+coin;
    return new Promise(function(resolve, reject){
  
      request(url, function(error, response, body){
        let info_jason = JSON.parse(body);
        let key = Object.keys(info_jason);
        let resultUpbit="업비트\t"+info_jason[0]['tradePrice']+"\t"+info_jason[0]['changePrice']+"\n"
        //let result = "id: "+info_jason['id']+"\tLevel: "+info_jason['summonerLevel'];
        //console.log(info_jason);
        //resolve(info_jason);
        resolve(resultUpbit);
  
      })
    })
  
  };
  
function printUpbit(coin){
    getUpbit(coin).then(function (text){
        //let resultUpbit="업비트\t"+text[0]['tradePrice']+"\t"+text[0]['changePrice']+"\n"
        console.log(text);
        //console.log(resultUpbit);
        return(text);
        

    },function (){
        console.log('error');

      });
}




function printCoin(coin){
    let coinResult=coin+" 코인 시세\n거래소\t\t실시간 시세(KRW)\t24시간 변동률\n";
    coinResult=coinResult+printUpbit(coin);
    

    return coinResult;
    
};

console.log(printCoin("BTC"));


server.listen(3000, function() {
    console.log('Server On !');
});