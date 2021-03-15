const axios = require('axios');
const urlencode = require('urlencode');

const {
    RIOT_KEY,
    RIOT_TFT_KEY
} = require('../../key.json');

const rankToString = (rank) => rank && rank.length > 0 ? `${rank[0].tier} ${rank[0].rank} ${rank[0].leaguePoints}LP` : 'UnRanked';

const getSummonerInfo = async (nickname) =>
    await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlencode(nickname)}?api_key=${RIOT_KEY}`)
    .then(res => res.data)
    .catch(err => err);

const getSummonerRank = async (lolid) =>
    await axios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${lolid['id']}?api_key=${RIOT_KEY}`)
    .then(res => res.data)
    .catch(err => err);

const getSummonerInfoTft = async (nickname) =>
    await axios.get(`https://kr.api.riotgames.com/tft/summoner/v1/summoners/by-name/${urlencode(nickname)}?api_key=${RIOT_TFT_KEY}`)
    .then(res => res.data)
    .catch(err => err);

const getSummonerRankTft = async (lolid) =>
    await axios.get(`https://kr.api.riotgames.com/tft/league/v1/entries/by-summoner/${lolid['id']}?api_key=${RIOT_TFT_KEY}`)
    .then(res => res.data)
    .catch(err => err);

//롤 서버 Status
const getLolStatus = async () =>
    await axios.get(`https://kr.api.riotgames.com/lol/status/v4/platform-data?api_key=${RIOT_KEY}`)
    .then(res => res.data)
    .catch(err=>err);

//롤 관전
const getLolSpectator = async(lolid) =>
    await axios.get(`https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${lolid}?api_key=`)
    .then(res => res.data)
    .catch(err =>err);




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

module.exports = {
    getSummonerInfo,
    getSummonerRank,
    getSummonerInfoTft,
    getSummonerRankTft,
    makeDiscordEmbed,
    getLolStatus,
    printLolStatus,
    getLolSpectator
}