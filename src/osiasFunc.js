const lolutils = require('./utils/lolutils');
const coinutils = require('./utils/coinutils');

const getLoLInfo = async (command) => {
    let nickname = command.substring(command.indexOf(' ') + 1);

    let summoner = await lolutils.getSummonerInfo(nickname);
    let summonertier = await lolutils.getSummonerRank(summoner);
    let nicknametft = await lolutils.getSummonerInfoTft(nickname);
    let summonertfttier = await lolutils.getSummonerRankTft(nicknametft);
    
    let result = lolutils.makeDiscordEmbed(nickname, summoner, summonertier, nicknametft, summonertfttier);
    return result;
}

const getCoin = async (command) => {
    if(command.length > 1) {
        const coinName = command[1];
        let resultcoin = `${coinName} 코인 시세\n거래소\t\t실시간 시세(KRW)\t\t24시간 변동률\n`;
        let coindata = await coinutils.getUpbit(coinName);
        return `${resultcoin}\n${coindata}`;
    } else {
        return  '(이름) 형태로 입력해주세요';
    }
}

module.exports = {
    getLoLInfo, getCoin
};