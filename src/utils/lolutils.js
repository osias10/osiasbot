const axios = require('axios');
const urlencode = require('urlencode');
const fs=require('fs');
const osiasbot = require('../osiasbot');


//관전파일 임시 생성 경로
const tmppath = '/ramdisk/';
//const tmppath = './src/files/'

const {
    RIOT_KEY,
    RIOT_TFT_KEY
} = require('../../key.json');

const mathjs = require('mathjs');



const rankToString = (rank) => rank && rank.length > 0 ? `${rank[0].tier} ${rank[0].rank} ${rank[0].leaguePoints}LP` : 'UnRanked';

const getSummonerInfo = async (nickname) =>
    await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlencode(nickname)}?api_key=${RIOT_KEY}`)
    .then(res => res.data)
    .catch(err => err);

const getSummonerRank = async (lolid) =>
    await axios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${lolid}?api_key=${RIOT_KEY}`)
    .then(res => res.data)
    .catch(err => err);

const getSummonerInfoTft = async (nickname) =>
    await axios.get(`https://kr.api.riotgames.com/tft/summoner/v1/summoners/by-name/${urlencode(nickname)}?api_key=${RIOT_TFT_KEY}`)
    .then(res => res.data)
    .catch(err => err);

const getSummonerRankTft = async (lolid) =>
    await axios.get(`https://kr.api.riotgames.com/tft/league/v1/entries/by-summoner/${lolid}?api_key=${RIOT_TFT_KEY}`)
    .then(res => res.data)
    .catch(err => err);

//롤 서버 Status
const getLolStatus = async () =>
    await axios.get(`https://kr.api.riotgames.com/lol/status/v4/platform-data?api_key=${RIOT_KEY}`)
    .then(res => res.data)
    .catch(err=>err);

//롤 관전
//gameQueueConfigId 430: 일반 , 420: 랭크 450: 무작위
const getLolSpectator = async(lolid) =>
    await axios.get(`https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${lolid['id']}?api_key=${RIOT_KEY}`)
    .then(res => res.data)
    .catch(err =>err);
const getSummonerChampion = async(lolid) =>
    await axios.get(`https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${lolid}?api_key=${RIOT_KEY}`)
    .then(res => res.data)
    .catch(err =>err);

const getChampionList = async()=>
    await axios.get(`http://ddragon.leagueoflegends.com/cdn/${lolLatestVersion}/data/ko_KR/champion.json`)
    .then(res=>res.data)
    .catch(err =>err);

const getChampionListFull = async()=>
    await axios.get('http://ddragon.leagueoflegends.com/cdn/11.6.1/data/ko_KR/championFull.json')
    .then(res=>res.data)
    .catch(err =>err);

const getChampionFace = async(championName)=>
    await axios.get(`http://ddragon.leagueoflegends.com/cdn/11.13.1/img/champion/${championName}.png`)
    .then(res=>res.data)
    .catch(err => err);

const getSpellList= async()=>
    await axios.get(`http://ddragon.leagueoflegends.com/cdn/11.15.1/data/en_US/summoner.json`)
    .then(res=>res.data)
    .catch(err =>err)
/*
const getLolVersion = async() =>
    await axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
    .then(res=>res.data)
    .catch(err=> err)

    */
async function getLolVersion(){
    const res = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
    return (res.data);
}


function printGameType(lolSpectator){
    if (lolSpectator){
        switch (lolSpectator.gameQueueConfigId){
            case 430 : return "일반";
            case 420 : return "솔로 랭크";
            case 440 : return "자유 랭크";
            case 450 : return "무작위 총력전";
        }
    }
    else return ("게임정보가 없습니다");
}
function printGameMode(lolSpectator){
    if (lolSpectator){
        switch (lolSpectator.gameMode){
            case "CLASSIC" : return "소환사의 협곡";
            case "ARAM" : return ("칼바람 나락");
        }
    }
    else return "정보가 없습니다.";
}

function printGameMap(lolSpectator){
    if (lolSpectator){
        switch (lolSpectator.gameMode){
            case "CLASSIC" : return (11);
            case "ARAM" : return (12);
        }
    }
    else return 0;
}
//게임 경과 시간 계산
function calIngameTime(startTime){
    
    const currentTime = new Date().getTime();
    const diffTime= currentTime-startTime;
    const diffSec = diffTime/1000;
    const diffMin = diffTime/1000/60;

    console.log(currentTime);

    return (`${Math.floor(diffMin)}분 ${Math.floor(diffSec-(Math.floor(diffMin)*60))}초`);
}

//소환사 티어 알림 (관전)(이미지)
function printSpectatorTierImg(tier,gameType){
    //const tier = await getSummonerRank(id);
    if (gameType === 440){
        const flexRank = tier.filter(obj => obj['queueType'] === 'RANKED_FLEX_SR');
        if (flexRank[0] !=undefined){
            return (flexRank[0].tier);
        }
             
        else return('Unranked');
    }
    else {
        const soloRank = tier.filter(obj => obj['queueType'] === 'RANKED_SOLO_5x5');
        
        if(soloRank[0] !=undefined){
            return (soloRank[0].tier);

        
        }
        else return('Unranked');
    }
}
//게임모드의 티어 출력
async function printSpectatorTier(id,gameType){
    const tier = await getSummonerRank(id);
    if (gameType === 440){
        const flexRank = tier.filter(obj => obj['queueType'] === 'RANKED_FLEX_SR');
        if (flexRank[0] !=undefined){
            switch((flexRank[0].tier)){
                case 'CHALLENGER' : return 'CH'
                case 'GRANDMASTER' : return 'GM';
                default : return (`${(flexRank[0].tier)[0]}${flexRank[0].rank}`);
            }
        }
             
        else return('Un');
    }
    else {
        const soloRank = tier.filter(obj => obj['queueType'] === 'RANKED_SOLO_5x5');
        
        if(soloRank[0] !=undefined){
            switch((soloRank[0].tier)){
                case 'CHALLENGER' : return 'CH'
                case 'GRANDMASTER' : return 'GM';
                default : return(`${(soloRank[0].tier)[0]}${soloRank[0].rank}`);
            }

             


        }
        else return('Un');
    }
}
//승률 계산
function printSpectatorRankW(tier,gameType){
    if (gameType === 440){
        const flexRank = tier.filter(obj => obj['queueType'] === 'RANKED_FLEX_SR');
        if (flexRank[0] !=undefined){
            return flexRank[0]
        }
             
        else return('Un');
    }
    else {
        const soloRank = tier.filter(obj => obj['queueType'] === 'RANKED_SOLO_5x5');
        
        if(soloRank[0] !=undefined){
            return soloRank[0]

             


        }
        else return('Un');
    }
}
//관전 이미지 티어 출력
function printSpectatorTier2(tier,gameType){
    if (gameType === 440){
        const flexRank = tier.filter(obj => obj['queueType'] === 'RANKED_FLEX_SR');
        if (flexRank[0] !=undefined){
            switch((flexRank[0].tier)){
                case 'CHALLENGER' : return `CHALLENGER (${flexRank[0].leaguePoints} LP)`;
                case 'GRANDMASTER' : return `GRANDMASTER (${flexRank[0].leaguePoints} LP)`;
                default : return (`${(flexRank[0].tier)} ${flexRank[0].rank} (${flexRank[0].leaguePoints} LP)`);
            }
        }
             
        else return('Unranked');
    }
    else {
        const soloRank = tier.filter(obj => obj['queueType'] === 'RANKED_SOLO_5x5');
        
        if(soloRank[0] !=undefined){
            switch((soloRank[0].tier)){
                case 'CHALLENGER' : return `CHALLENGER (${soloRank[0].leaguePoints} LP)`
                case 'GRANDMASTER' : return `GRANDMASTER (${soloRank[0].leaguePoints} LP)` ;
                default : return(`${(soloRank[0].tier)} ${soloRank[0].rank} (${soloRank[0].leaguePoints} LP)`);
            }

             


        }
        else return('Unranked');
    }
}

/*

function sendLolSpectator(lolSpectator){
  fs.readFile('./../lolSpector.bat','utf8',function (err,data){
      if (err) return console.log(err);
      else{
          let result = data.replace(/encryptionKey/g, lolSpectator.observers.encryptionKey);
          let result2 = result.replace(/gameId/g, lolSpectator.gameId);
          fs.writeFile(someFile,result2,'utf8',function(err){
              if (err) return console.log(err);
          })
      }
  })
}
*/
async function sendLolSpectator(lolSpectator){
    const data= await fs.readFileSync('./src/files/lolSpector.bat','utf8');
    const result = data.replace(/encryptionKey/g, lolSpectator.observers.encryptionKey);
    
    const result2 = result.replace(/gameId/g, lolSpectator.gameId);
    const filename=`${lolSpectator.gameId}-${mathjs.randomInt(0,9999)}`;
    fs.writeFileSync(`${tmppath}lolSpector-${filename}.bat`,result2,'utf8');
    return (`${tmppath}lolSpector-${filename}.bat`);
}



function printTierEmoji(tier){
    if (tier[0]){
        switch (tier[0].tier){
            case "IRON" : return "<:Iron:818836568797478972> ";
            case "BRONZE" : return "<:Bronze:818836568592744468> ";
            case "SILVER" : return "<:Silver:818836568931565579> " ;
            case "GOLD" : return "<:Gold:818836568931958794> ";
            case "PLATINUM" : return "<:Platinum:818836568310808607> ";
            case "DIAMOND" : return "<:Diamond:818836568697602088> ";
            case "MASTER" : return "<:Master:818836568776376320> ";
            case "GRANDMASTER" : return "<:Grandmaster:818836568554471434> ";
            case "CHALLENGER" : return "<:Challenger:818836568659066950> ";
            default : return "";
        }
    }
    else return ""
}

//게임판수 , 승률 프린트
function printGameCounts(Rank){
    if (Rank[0]){
        return `${Rank[0].wins+Rank[0].losses}전 ${Rank[0].wins}승 ${Rank[0].losses}패 ${((Rank[0].wins/(Rank[0].wins+Rank[0].losses)*100).toFixed())}%`;
    }
    else return "";
}




function makeDiscordEmbed(nickname, summonerInfo, summonerRank, summonerInfoTft, summonerRankTft) {
    const soloRank = summonerRank.filter(obj => obj['queueType'] === 'RANKED_SOLO_5x5');
    const summonerSoloRank = rankToString(soloRank);

    const flexRank = summonerRank.filter(obj => obj['queueType'] === 'RANKED_FLEX_SR');
    const summonerFlexRank = rankToString(flexRank);
    


    const summonerTFTRank = rankToString(summonerRankTft);
    //console.log(summonerRankTft);
    return ({
        'content': '소환사 정보',
        'embed': {
            'title': `Level  ${summonerInfo.summonerLevel}`,
            'description': '여기에 뭘 추가하지',
            'url': `https://www.op.gg/summoner/userName=${urlencode(nickname)}`,
            'color': 16724889,
            'footer': {
                'icon_url': '',
                'text': 'KR'
            },
            'thumbnail': {
                'url': `http://ddragon.leagueoflegends.com/cdn/11.5.1/img/profileicon/${summonerInfo.profileIconId}.png`
            },
            'image': {
                'url': ' '
            },
            'author': {
                'name': nickname,
                'url': `https://www.op.gg/summoner/userName=${urlencode(nickname)}`,
                'icon_url': 'https://ww.namu.la/s/c697070bee957de3acbbf033eb001ac7705b9703e48813bc8b7ccaa0efb22d712a564b9d0c8580148a138b0761720fe6f2d9d82192ab14eb7ca7e5b1f8b38bff8f00aaa28bd0b9929715cbf92350e8d6fb705e7630086aaced366e7758fcd05b'
            },
            'fields': [{
                    'name': '개인 랭크',
                    'value': `${printTierEmoji(soloRank)} ${summonerSoloRank}\n${printGameCounts(soloRank)}`,
                    'inline': true
                },
                {
                    'name': '자유 랭크',
                    'value': `${printTierEmoji(flexRank)} ${summonerFlexRank}\n${printGameCounts(flexRank)}`,
                    'inline': true
                },
                {
                    'name': 'TFT 랭크',
                    'value': `${printTierEmoji(summonerRankTft)} ${summonerTFTRank}\n${printGameCounts(summonerRankTft)}`,
                    'inline': true
                },
            ],
        }
    });
}

function printLolStatus(lolStatus){

    let lolStatusEmbed ={
        'content': '',
        'embed': {
            'title': `서버 상태`,
            'description': '',
            'url': `https://status.riotgames.com/?locale=ko_KR`,
            'color': 16724889,
            'footer': {
                'icon_url': '',
                'text': 'KR'
            },
            'thumbnail': {
                'url': `https://w.namu.la/s/f8d74325cc664de8372ea7c07da672a55da4b6a4c1053bad4cf36271d8a2cf1dc561bdb0e9ec1cdd66db82e747757d8ced822edbb54d80a8644ae2c3320079feb9677de31da399cb192f246247bd13af04a97188e754b3478b2cdcead2072cf362923ab6dbd76cf1513806f3a3c10b03`
            },
            'image': {
                'url': ' '
            },
            'author': {
                'name': 'League of legend',
                'url': `https://status.riotgames.com/?locale=ko_KR`,
                'icon_url': 'https://ww.namu.la/s/c697070bee957de3acbbf033eb001ac7705b9703e48813bc8b7ccaa0efb22d712a564b9d0c8580148a138b0761720fe6f2d9d82192ab14eb7ca7e5b1f8b38bff8f00aaa28bd0b9929715cbf92350e8d6fb705e7630086aaced366e7758fcd05b'
            },
            'fields': [
                
            ],
        }
    };

    if ((lolStatus.incidents).length>0){
        for (let i=0;i<(lolStatus.incidents).length;i++){
            (lolStatusEmbed.embed.fields).push({'name': `서버 상태 ${i+1}`, 'value':lolStatus.incidents[i].titles[0].content,'inline':false});
        }
    }
    else{
        (lolStatusEmbed.embed.fields).push({'name': "서버 상태 1", 'value':'정상입니다.','inline':false});
    }
    console.log(lolStatusEmbed.embed.fields);
    return lolStatusEmbed;
}

//blueteam : 100 redTeam: 200
async function printInGame(lolIngame){
    let blueTeam='';
    let redTeam='';
    
    let lolIngameEmbed = {
        'content': '',
        'embed': {
            'title': `${printGameType(lolIngame)}\t${calIngameTime(lolIngame.gameStartTime)}`,
            'description': '',
            'url': ` `,
            'color': 16724889,
            'footer': {
                'icon_url': '',
                'text': 'KR'
            },
            'thumbnail': {
                'url': `https://ddragon.leagueoflegends.com/cdn/6.8.1/img/map/map${printGameMap(lolIngame)}.png`
            },
            'image': {
                'url': ' '
            },
            'author': {
                'name': (printGameMode(lolIngame)),
                'url': `https://matchhistory.kr.leagueoflegends.com/ko/#match-details/KR/${lolIngame.gameId}`,
                'icon_url': 'https://ww.namu.la/s/c697070bee957de3acbbf033eb001ac7705b9703e48813bc8b7ccaa0efb22d712a564b9d0c8580148a138b0761720fe6f2d9d82192ab14eb7ca7e5b1f8b38bff8f00aaa28bd0b9929715cbf92350e8d6fb705e7630086aaced366e7758fcd05b'
            },
            'fields': [
                
            ],
        }
    };
    const blueTeams = lolIngame.participants.filter(obj => obj['teamId']===100);
    const redTeams = lolIngame.participants.filter(obj => obj['teamId']===200);
    //console.log(blueTeams);
    
    if(blueTeams.length>0){
        let blueTier='Un';
        for (let i=0;i<blueTeams.length;i++){
            blueTier = await printSpectatorTier(blueTeams[i].summonerId,lolIngame.gameQueueConfigId);
            blueTeam += `\`${blueTier}\` ${blueTeams[i].summonerName}\n`;
            
        }
    }
    else {blueTeam = "소환사가 존재하지 않습니다."};
    let redTier='Un';
    if(redTeams.length>0){
        
        for (let j=0;j<redTeams.length;j++){
            redTier =  await printSpectatorTier(redTeams[j].summonerId,lolIngame.gameQueueConfigId);
            redTeam += `\`${redTier}\` ${redTeams[j].summonerName}\n`;
            
            
        }
    }
    else {redTeam = "소환사가 존재하지 않습니다."};
    
    

    
    (lolIngameEmbed.embed.fields).push({'name': '블루팀', 'value': blueTeam, 'inline':true});
    (lolIngameEmbed.embed.fields).push({'name': '레드팀', 'value': redTeam, 'inline':true});
    
    return lolIngameEmbed;


}


module.exports = {
    getSummonerInfo,
    getSummonerRank,
    getSummonerInfoTft,
    getSummonerRankTft,
    makeDiscordEmbed,
    getLolStatus,
    printLolStatus,
    getLolSpectator,
    printInGame,
    sendLolSpectator,
    getSummonerChampion,
    getChampionList,
    getChampionListFull,
    getSpellList,
    printSpectatorTier,
    printSpectatorTierImg,
    printSpectatorRankW,
    printSpectatorTier2,
    printGameType,
    printGameMode,
    calIngameTime,
    getLolVersion
}