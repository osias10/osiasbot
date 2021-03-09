const Discord = require("discord.js");
let printCoin=require('./getBitcoin');

const client = new Discord.Client();
//gittest
//크롤링
const axios = require("axios");
const cheerio = require("cheerio");

const request =require("request");

const urlencode= require('urlencode');

let keys = require('./key.json');


const liot_api = keys.Riot_key;
const discord_key = keys.Discord_key;
const riot_tft_api = keys.Riot_tft_key;
const commandLetter = "*";



function searchopgg(nickname){
  const getHtml = async () => {
    try {
      return await axios.get("https://www.op.gg/summoner/userName="+nickname);

    } catch(error){
      console.log(error(error));
    }
  };

  getHtml()
    .then(html => {
      let ulList = [];
      const $ = cheerio.load(html.data);
      const $bodyList = $("div.SideContent div.TierBox.Box").children("div.TierRankInfo");


      $bodyList.each(function(i,elem) {
        ulList[i] ={
          tier : $(this).find('div.TierRank').text()
/*
          title: $(this).find('strong.news-tl a').text(),
          url: $(this).find('strong.news-tl a').attr('href'),
          image_url: $(this).find('p.poto a img').attr('src'),
          image_alt: $(this).find('p.poto a img').attr('alt'),
          summary: $(this).find('p.lead').text().slice(0, -11),
          date: $(this).find('span.p-time').text()
          */
        };
      });

      const data = ulList.filter(n=>n.tier);

      console.log(ulList);
      return data;

  })
}


function opgg(nickname){
  let option = {
    encoding: "utf-8",
    method: "GET",
    uri: "https://www.op.gg/summoner/userName="+nickname
  }
  request(option, function(err,res,html){
    let $ = cheerio.load(html);
    let data = $(".TierRank").text();

    console.log($(".TierRank").text());
    console.log(data);

    return data;
  });

}


//롤 id 검색
/*
function lolid(nickname){

  let url="https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ urlencode(nickname) +"?api_key="+ liot_api;

  return new Promise(resolve=>{

    request(url, function(error, response, body){
      let info_jason = JSON.parse(body);
      let key = Object.keys(info_jason);
    //  console.log(key);

      //let result = "id: "+info_jason[key]['id'] + "name: "+info_jason[key]["name"] +"summonerLevel :" + info_jason[key]["summonerLevel"];
      //let result = "id: "+info_jason[key]["id"] + "name: "+info_jason[key]["name"] +"summonerLevel :" + info_jason[key]["summonerLevel"];
      let result = "id: "+info_jason['id']+"\tLevel: "+info_jason['summonerLevel'];
      console.log("info_jason: "+info_jason);
      console.log("test");
      console.log(result);
      resolve(info_jason);

    })
  })

}

*/
// 롤 api 소환사id 정보 가져오기
const lolid=function(nickname){

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

}

//롤 id값으로 랭크 정보 가져오기
const loltier=function(id){

  let url="https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/"+id +"?api_key="+ liot_api;

  return new Promise(function(resolve, reject){

    request(url, function(error, response, body){
      let info_tier = JSON.parse(body);
      let key = Object.keys(info_tier);
    //  console.log(key);

      //let result = "id: "+info_jason[key]['id'] + "name: "+info_jason[key]["name"] +"summonerLevel :" + info_jason[key]["summonerLevel"];
      //let result = "id: "+info_jason[key]["id"] + "name: "+info_jason[key]["name"] +"summonerLevel :" + info_jason[key]["summonerLevel"];
      //let result = "id: "+info_jason['id']+"\tLevel: "+info_jason['summonerLevel'];
      //console.log("info_jason: "+info_jason);
      //console.log("test");
      //console.log(result);
      console.log(info_tier);
      //console.log("console Tier: "+info_tier[0]['tier']);
      resolve(info_tier);

    })
  })


}

//전략적 팀전투 계정 정보 가져오기

const tftid=function(nickname){

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

}




//전략적 팀 전투 랭크 정보 가져오기
const tfttier=function(id){
  let url="https://kr.api.riotgames.com/tft/league/v1/entries/by-summoner/"+id+"?api_key="+riot_tft_api;
  return new Promise(function(resolve, reject){
    request(url, function(error,response,body){
      let info_tfttier= JSON.parse(body);
      console.log(info_tfttier);
      resolve(info_tfttier);
    })
  })
}



//랭크 유형 정보 (자유랭크, 솔로랭크 구분)

function queueTypePrint(queueType){
  if(queueType ==="RANKED_SOLO_5x5") return "솔로랭크";
  else if(queueType==="RANKED_FLEX_SR"); return "자유랭크";
}


//가위바위보
//https://blog.naver.com/PostView.nhn?blogId=azure0777&logNo=221378379404&redirect=Dlog&widgetTypeCall=true&directAccess=false
function rock(person,input){
  let hands=["가위","바위","보"];
  let results=["비겼습니다.",person+"님이 이겼습니다!",person+"님이 졌습니다..."];
  let you=hands.indexOf(input);
  let com=Math.floor(Math.random()*3);
  if (you != -1){
    
    let game = (3+you-com)%3;
    console.log(person+": "+hands[you]+"\t 컴퓨터: "+hands[com]+"\n"+results[game]);
    let data = ("\n"+person+": "+hands[you]+"\t 컴퓨터: "+hands[com]+"\n"+results[game]);
    return data;
  }
  else {
    let data=person+"님의 반칙입니다"
    return data;
  }
}

//비트코인

//시세 조회 (upbit만)
function promisetest(coin){
  return Promise.all([printCoin.upbit(coin)]);
}




client.on("ready", () => {
  console.log("준비 완료!");
});

client.on("message", msg => {
  if (msg.content == "ping") {
    //msg.reply("🏓 pong! `지연시간: "+Date.now()-msg.createdTimestamp +"API 지연시간: "+Math.floor(client.ws.ping)+"ms`");
    msg.reply("🏓 pong! `API 지연시간: "+Math.floor(client.ws.ping)+"ms`");

  }
  let getcommand = msg.content;
  

  if (msg.content.startsWith(commandLetter)){
    let getcommand2=getcommand.substring(1,getcommand.length);
    console.log("getcommand2: "+getcommand2);
    m=getcommand2.trim().split(/ +/);

    if (getcommand2.startsWith("dice")||getcommand2.startsWith("주사위")){
        //m = getcommand2.split(' ');
        if ((typeof m[1]!= "undefined") ||(typeof  m[2] != undefined)){

            msg.reply(m[1]+", "+ m[2]);
            console.log( msg.author.username+" 님에게 답장");
          }else{
            msg.reply("(시작할 숫자) (마지막 숫자) 를 입력해 주세요");
          }
        }



        else if (getcommand2.startsWith("롤티어")){
          //m = getcommand2.split(' ');
          let nickname = m[1];
          let tier =opgg(nickname);
          msg.reply(nickname+"의 티어 검색결과\n"+tier);
        }
        if (getcommand2.startsWith("가위바위보")){
          //m = getcommand2.split(' ');
          let you = m[1];
          let data = rock(msg.author.username,m[1]);
          msg.reply(data);

        }
        else if (getcommand2.startsWith("롤내전")){
          let result="https://lolbalance.osias.duckdns.org";
          msg.reply(result);
        }
        else if (getcommand2.startsWith("롤")){
          //m=getcommand2.split(' ');
          let nickname=m[1];
          //let info_summoner=lolid(nickname);
          //lolid(nickname);
          let summonerId;
          let summonerLevel;
          let summonerinfo;
          let summonerinfo2;
          let summonerinfo3;
          let result;
          lolid(nickname).then(function (text){
            console.log("id: "+text['id']);
            let level=nickname+"의 레벨 :"+text['summonerLevel'];
            summonerLevel=text['summonerLevel'];
            summonerId=text['id'];

            loltier(summonerId).then(function (gettier){

              if (text['id']== undefined){
                result="없는 소환사 입니다.";
                console.log("존재하지 않는 소환사명:"+summonerId);
                msg.reply("\n```\n"+result+"\n```");
              }
              else{
                if (gettier[0]){
                  if ((gettier[0]['queueType']==="RANKED_SOLO_5x5")){
                    console.log("tier: "+gettier[0]['tier']);
                    summonerinfo= (level+"\n랭크유형: "+queueTypePrint(gettier[0]['queueType'])+"\t티어: "+gettier[0]['tier']+" "+gettier[0]['rank']);
                  
                    if (gettier[1]&&gettier[1]['queueType']==="RANKED_FLEX_SR"){
                      summonerinfo2 =("\n랭크유형: "+queueTypePrint(gettier[1]['queueType'])+"\t티어: "+gettier[1]['tier']+" "+gettier[1]['rank']);
                    }
                    else{
                      summonerinfo2=("\n자유랭크 정보가 없습니다.");
                    }
                  }
                  else if(gettier[0]['queueType']==="RANKED_FLEX_SR"){
                    summonerinfo2 =("\n랭크유형: "+queueTypePrint(gettier[0]['queueType'])+"\t티어: "+gettier[0]['tier']+" "+gettier[0]['rank']);
                    summonerinfo= (level+"\n솔로랭크 정보가 없습니다.");
                  }
                  
                }
                else{
                  summonerinfo= (level+"\n솔로랭크 정보가 없습니다.");
                  summonerinfo2=("\n자유랭크 정보가 없습니다.");
                }
                tftid(nickname).then(function(tftSummoner){
                  let tftSummonerID=tftSummoner['id'];
                  tfttier(tftSummonerID).then(function(gettfttier){
                    //console.log(text['id']);
                    console.log(gettfttier[0]);
                  
                    if(gettfttier[0]!=undefined){
                      summonerinfo3=("\n랭크유형: 전략적팀전투\t티어: "+gettfttier[0]['tier']+" "+gettfttier[0]['rank']);
                    }
                    else{
                      summonerinfo3=("\n전략적팀전투 정보가 없습니다.");
                    }

                    result=("```\n"+summonerinfo+summonerinfo2+summonerinfo3+"\n```");
                    console.log(result);
                    msg.reply("\n"+result);

                  },function(){
                    console.log('error');
                  });

                },function(){
                  console.log('tftid_error');
                });

                
              }

            },function(){
              console.log('error');

            });



          //  msg.reply(level);
            //return text;
          },function (){
            console.log('error');

          });




        //  console.log("id: "+testsummoner['id']);

          //console.log("info_summoner: "+info_summoner);



          //console.log("info_summoner: "+JSON.stringify(info_summoner));


        }
        else if(getcommand2.startsWith("바보")){
          //m=getcommand2.split(' ');
          let name=m[1];
          //msg.reply(name+": 두부 바보\n포항항ꉂꉂ(ᵔᗜᵔ)ㅋㅋㅋㅋ:cruise_ship::ocean:");
          if (name) {msg.channel.send(name+" 바보\n포항항ꉂꉂ(ᵔᗜᵔ)ㅋㅋㅋㅋ:cruise_ship::ocean:");}
          else{msg.channel.send(msg.guild.member(msg.author).displayName+" 바보\n포항항ꉂꉂ(ᵔᗜᵔ)ㅋㅋㅋㅋ:cruise_ship::ocean:");}

        }
        else if (getcommand2.startsWith("비트코인")){
          //m=getcommand2.split(' ');
          let coinkind=m[1];
          let resultcoin = coinkind+" 코인 시세\n거래소\t\t실시간 시세(KRW)\t\t24시간 변동률\n"
          promisetest(coinkind).then(function(data){
            msg.reply(resultcoin+data);
        })
        }

        else if(getcommand2.startsWith("플레")){
          //m=getcommand2.split(' ');
          
          msg.reply("<:2482_Platinium:818816782088798239>");

        }

      }


});

client.login(discord_key);
