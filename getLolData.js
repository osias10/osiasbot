const axios = require("axios");

const urlencode= require('urlencode');

const {Riot_key, Riot_tft_key, Discord_key} = require('./key.json');



/*
let keys = require('./key.json');
const liot_api = keys.Riot_key;
const discord_key = keys.Discord_key;
const riot_tft_api = keys.Riot_tft_key;
*/

/*

const getSummonerInfo = async (nickname) => 
    await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlencode(nickname)}?api_key=${RIOT_key}`)
        .then(res => JSON.parse(res))
        .catch(err => undefined)


const getSummonerInfo = async (nickname) => 
    await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlencode(nickname)}?api_key=${RIOT_key}`)
        .then(res => JSON.parse(res))
        .catch(err => undefined)


const getSummonerRank = async (id) =>
    await axios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${lolid['id']}?api_key=${liot_api}`)
        .then(res => JSON.parse(res))
        .catch(err => undefined)



module.export= {getSummonerinfo : getSummonerInfo, 
                getSummonerrank : getSummonerRank};

*/
function getListFilter(data,key,value){
    //console.log("jason검색 함수)");
    //console.log(data);
    //console.log("jason검색 데이터 위에");
    return data.filter(function(object){
        return object[key]===value;
    });
}


function queueTypePrint(queueType){
    if(queueType ==="RANKED_SOLO_5x5") return "솔로랭크";
    else if(queueType==="RANKED_FLEX_SR"); return "자유랭크";
  }


module.exports={
    getSummonerInfo: async function(nickname){
        return await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlencode(nickname)}?api_key=${Riot_key}`)
        .then(res => (res.data))
        .catch(err => err)
    },

    getSummonerRank: async function(lolid){
        return await axios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${lolid['id']}?api_key=${Riot_key}`)
        .then(res => (res.data))
        .catch(err => err)
    },

    getSummonerInfoTft: async function(lolid){
        return await axios.get(`https://kr.api.riotgames.com/tft/summoner/v1/summoners/by-name/${lolid['id']}?api_key=${Riot_tft_key}`)
        .then(res => (res.data))
        .catch(err => err)
    },

    getSummonerRankTft: async function(lolid){
        return await axios.get(`https://kr.api.riotgames.com/tft/league/v1/entries/by-summoner/${lolid['id']}?api_key=${Riot_tft_key}`)
        .then(res => (res.data))
        .catch(err => err)
    },

    makeDiscordEmbed :  function(nickname,summonerInfo,summonerRank,summonerInfoTft,summonerRankTft){
        let summonerSoloRank;
        let summonerFlexRank
        //console.log("하나");
        //console.log(summonerRank);
        //console.log("듀ㅜㄹ");
        const checkSoloRank = getListFilter(summonerRank,"queueType","RANKED_SOLO_5x5");
        if(checkSoloRank) {summonerSoloRank = `${checkSoloRank.tier} ${checkSoloRank.rank}`}
        else {summonerSoloRank = "UnRanked";}
        const checkFlexRank =getListFilter(summonerRank,"queueType","RANKED_FLEX_SR");
        if(checkFlexRank) { summonerFlexRank = `${checkFlexRank.tier} ${checkFlexRank.rank}`}
        else { summonerFlexRank = "UnRanked";}
        //console.log(getListFilter(summonerRank,"queueType","RANKED_SOLO_5x5"));
        console.log(summonerRank[0]["queueType"]);
        //console.log(summonerSoloRank);

        const DiscordEmbed={
            "content":"소환사 정보",
            "embed":{
                "title": summonerInfo.summonerLevel,
                "description": "내용",
                "url":`https://www.op.gg/summoner/userName=${nickname}`,
                "color": 16724889,
                "footer":{
                    "icon_url":"",
                    "text": "KR"
                },
                "thumbnail":{
                    "url": "https://cdn.discordapp.com/embed/avatars/0.png"
                },
                "image":{
                    "url": " "
                },
                "author": {
                    "name": nickname,
                    "url": "https://op.gg",
                    "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
                },
                    "fields": [
                        {
                            "name": "개인 랭크",
                            "value": summonerSoloRank,
                            "inline": true
                        },

                        {
                            "name": "자유 랭크",
                            "value": summonerFlexRank,
                            "inline": true
                        },

                        {
                            "name": "전략적팀전투 랭크",
                            "value": "테스트",
                            "inline": true
                        },
                    ],
                    
            
                
                
                
            }
        }

        return DiscordEmbed;
    }
}