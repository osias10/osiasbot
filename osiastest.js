const Discord = require("discord.js");
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

//https://blog.naver.com/PostView.nhn?blogId=azure0777&logNo=221378379404&redirect=Dlog&widgetTypeCall=true&directAccess=false
function rock(person,input){
  let hands=["가위","바위","보"];
  let results=["비겼습니다.",person+"님이 이겼습니다!",person+"님이 졌습니다..."];
  let you=hands.indexOf(input);
  let com=Math.floor(Math.random()*3);

  let game = (3+you-com)%3;
  console.log(person+": "+hands[you]+"\t 컴퓨터: "+hands[com]+"\n"+results[game]);
  let data = ("\n"+person+": "+hands[you]+"\t 컴퓨터: "+hands[com]+"\n"+results[game]);
  return data;
}



client.on("ready", () => {
  console.log("준비 완료!");
});

client.on("message", msg => {
  if (msg.content == "ping") {
    msg.reply("pong!`"+Math.floor(client.ping)+"ms`");
  }
  let getcommand = msg.content;

  if (msg.content.startsWith("$")){
    let getcommand2=getcommand.substring(1,getcommand.length);
    console.log("getcommand2: "+getcommand2);

    if (getcommand2.startsWith("dice")||getcommand2.startsWith("주사위")){
        m = getcommand2.split(' ');
        if ((typeof m[1]!= "undefined") ||(typeof  m[2] != undefined)){

            msg.reply(m[1]+", "+ m[2]);
            console.log( msg.author.username+" 님에게 답장");
          }else{
            msg.reply("(시작할 숫자) (마지막 숫자) 를 입력해 주세요");
          }
        }



        if (getcommand2.startsWith("롤티어")){
          m = getcommand2.split(' ');
          let nickname = m[1];
          let tier =opgg(nickname);
          msg.reply(nickname+"의 티어 검색결과\n"+tier);
        }
        if (getcommand2.startsWith("가위바위보")){
          m = getcommand2.split(' ');
          let you = m[1];
          let data = rock(msg.author.username,m[1]);
          msg.reply(data);

        }
        if (getcommand2.startsWith("롤")){
          m=getcommand2.split(' ');
          let nickname=m[1];
          //let info_summoner=lolid(nickname);
          //lolid(nickname);
          let summonerId;
          let summonerLevel;
          let summonerinfo;
          lolid(nickname).then(function (text){
            console.log("id: "+text['id']);
            let level=nickname+"의 레벨 :"+text['summonerLevel'];
            summonerLevel=text['summonerLevel'];
            summonerId=text['id'];

            loltier(summonerId).then(function (gettier){

              if (gettier[0]){
                console.log("tier: "+gettier[0]['tier']);
                summonerinfo= (level+"\t티어: "+gettier[0]['tier']+" "+gettier[0]['rank']);
              }
              else{
                summonerinfo= (level+"\t티어: 랭크 정보가 없습니다.");
              }

              msg.reply(summonerinfo);
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

      }


});

client.login(discord_key);
