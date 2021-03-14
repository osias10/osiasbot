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

const getSummonerInfoTft = async (lolid) =>
    await axios.get(`https://kr.api.riotgames.com/tft/summoner/v1/summoners/by-name/${lolid['id']}?api_key=${RIOT_TFT_KEY}`)
    .then(res => res.data)
    .catch(err => err);

const getSummonerRankTft = async (lolid) =>
    await axios.get(`https://kr.api.riotgames.com/tft/league/v1/entries/by-summoner/${lolid['id']}?api_key=${RIOT_TFT_KEY}`)
    .then(res => res.data)
    .catch(err => err);

function makeDiscordEmbed(nickname, summonerInfo, summonerRank, summonerInfoTft, summonerRankTft) {
    const soloRank = summonerRank.filter(obj => obj['queueType'] === 'RANKED_SOLO_5x5');
    const summonerSoloRank = rankToString(soloRank);

    const flexRank = summonerRank.filter(obj => obj['queueType'] === 'RANKED_FLEX_SR');
    const summonerFlexRank = rankToString(flexRank);

    const summonerTFTRank = rankToString(summonerRankTft);

    return ({
        'content': '소환사 정보',
        'embed': {
            'title': summonerInfo.summonerLevel,
            'description': '내용',
            'url': `https://www.op.gg/summoner/userName=${urlencode(nickname)}`,
            'color': 16724889,
            'footer': {
                'icon_url': '',
                'text': 'KR'
            },
            'thumbnail': {
                'url': 'https://cdn.discordapp.com/embed/avatars/0.png'
            },
            'image': {
                'url': ' '
            },
            'author': {
                'name': nickname,
                'url': 'https://op.gg',
                'icon_url': 'https://cdn.discordapp.com/embed/avatars/0.png'
            },
            'fields': [{
                    'name': '개인 랭크',
                    'value': summonerSoloRank,
                    'inline': true
                },
                {
                    'name': '자유 랭크',
                    'value': summonerFlexRank,
                    'inline': true
                },
                {
                    'name': '전략적팀전투 랭크',
                    'value': summonerTFTRank,
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