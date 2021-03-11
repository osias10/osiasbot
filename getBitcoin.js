let http = require('http');
let express = require('express');


const cheerio = require("cheerio");

const request =require("request");
let app = express();
var server= http.createServer(app);

/*
function printCoin(coin){
    let resultcoin=coin+" 코인 시세\n거래소\t\t실시간 시세(KRW)\t24시간 변동률\n";
    //const pm1 = new Promise((resolve, reject) => resolve('즉시 호출'))
    const upbit = new Promise(function(resolve,reject){
        let url="https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.KRW-"+coin;
        request(url, function(error, response, body){
            let info_jason = JSON.parse(body);
            let key = Object.keys(info_jason);
            let resultUpbit="업비트\t\t"+info_jason[0]['tradePrice']+"\t\t"+info_jason[0]['changePrice']+"\n"
            //let result = "id: "+info_jason['id']+"\tLevel: "+info_jason['summonerLevel'];
            //console.log(info_jason);
            //resolve(info_jason);
            resolve(resultUpbit);
      
          })
        

    })

    Promise.all([upbit])
        //.then(v=> console.log(v))
        .then(function (text){
            //let resultUpbit="업비트\t"+text[0]['tradePrice']+"\t"+text[0]['changePrice']+"\n"
            //console.log(text);
            //console.log(resultUpbit);
            resultcoin=resultcoin+text[0];
            console.log(resultcoin);
            return(resultcoin);
        },function (){
            console.log('error');
    
          });
}

*/
//console.log(printCoin("BTC"));

/*
server.listen(3000, function() {
    console.log('Server On !');
});
*/

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}




module.exports = {

    //let resultcoin = coin+" 코인 시세\n거래소\t\t실시간 시세(KRW)\t24시간 변동률\n";
    //const pm1 = new Promise((resolve, reject) => resolve('즉시 호출'))
    upbit: function(coin){
        return new Promise(function(resolve,reject){
           // let coin="BTC";
            let url="https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.KRW-"+coin;
            request(url, function(error, response, body){
                
                //let key = Object.keys(info_jason);
                if (body!=undefined){
                    let info_jason = JSON.parse(body);
                    let resultUpbit="업비트\t\t\t\t"+numberWithCommas(info_jason[0]['tradePrice'])+"\t\t\t\t\t\t"+numberWithCommas(info_jason[0]['changePrice'])+"\n"
                    //let result = "id: "+info_jason['id']+"\tLevel: "+info_jason['summonerLevel'];
                    //console.log(info_jason);
                    //resolve(info_jason);
                    resolve(resultUpbit);
                }
                else{
                    let resultUpbit = "업비트\t\t\t\t해당 코인정보가 존재하지 않습니다."
                    resolve(resultUpbit);
                }
                
      
            })
        

        })
    }

}