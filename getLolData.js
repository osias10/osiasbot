const axios = require("axios");
let keys = require('./key.json');
const urlencode= require('urlencode');



const liot_api = keys.Riot_key;
const discord_key = keys.Discord_key;
const riot_tft_api = keys.Riot_tft_key;


/*

const getSummonerInfo = async (nickname) => 
    await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlencode(nickname)}?api_key=${RIOT_API}`)
        .then(res => JSON.parse(res))
        .catch(err => undefined)


const getSummonerInfo = async (nickname) => 
    await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlencode(nickname)}?api_key=${RIOT_API}`)
        .then(res => JSON.parse(res))
        .catch(err => undefined)


const getSummonerRank = async (id) =>
    await axios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${lolid['id']}?api_key=${liot_api}`)
        .then(res => JSON.parse(res))
        .catch(err => undefined)



module.export= {getSummonerinfo : getSummonerInfo, 
                getSummonerrank : getSummonerRank};

*/

module.exports={
    getSummonerInfo: async function(nickname){
        return await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlencode(nickname)}?api_key=${liot_api}`)
        .then(res => (res.data))
        .catch(err => err)
    },

    getSummonerRank: async function(lolid){
        return await axios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${lolid['id']}?api_key=${liot_api}`)
        .then(res => (res.data))
        .catch(err => err)
    },

    makeDiscordEmbed : function(nickname,summonerInfo,summonerRank){
        const DiscordEmbed={
            "content":"소환사 정보",
            "embed":{
                "title": summonerInfo.summonerLevel,
                "description": "내용",
                "url":"https://op.gg",
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
                    "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
                    "fields": [
                        {
                            "name": "개인 랭크",
                            "value": "테스트",
                            "inline": true
                        },

                        {
                            "name": "솔로 랭크",
                            "value": "테스트",
                            "inline": true
                        },

                        {
                            "name": "전략적팀전투 랭크",
                            "value": "테스트",
                            "inline": true
                        },
                    ],
                    
                },
                
                
                
            }
        }

        return DiscordEmbed;
    }
}