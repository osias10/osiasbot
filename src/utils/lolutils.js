const axios = require('axios');
const urlencode = require('urlencode');

const {
    RIOT_KEY,
    RIOT_TFT_KEY
} = require('../../key.json');

const rankToString = (rank) => rank && rank.length > 0 ? `${rank[0].tier} ${rank[0].rank}` : 'UnRanked';

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
                'icon_url': 'https://cdn.discordapp.com/embed/avatars/0.png'
            },
            'fields': [{
                    'name': '개인 랭크',
                    'value': printTierEmoji(soloRank)+ summonerSoloRank,
                    'inline': true
                },
                {
                    'name': '자유 랭크',
                    'value': printTierEmoji(flexRank)+ summonerFlexRank,
                    'inline': true
                },
                {
                    'name': 'TFT 랭크',
                    'value': printTierEmoji(summonerRankTft)+ summonerTFTRank,
                    'inline': true
                },
            ],
        }
    });
}

module.exports = {
    getSummonerInfo,
    getSummonerRank,
    getSummonerInfoTft,
    getSummonerRankTft,
    makeDiscordEmbed
}