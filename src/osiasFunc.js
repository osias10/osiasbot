const lolutils = require('./utils/lolutils');
const coinutils = require('./utils/coinutils');

const getLoLInfo = async (command) => {
    let result;
    let nickname = command.substring(command.indexOf(' ') + 1);
    
    let summoner = await lolutils.getSummonerInfo(nickname);
    let summonertier = await lolutils.getSummonerRank(summoner);
    let nicknametft = await lolutils.getSummonerInfoTft(nickname);
    let summonertfttier = await lolutils.getSummonerRankTft(nicknametft);
    
    if(summoner.response!=undefined && summoner.response.status===404){
        result = "```해당 소환사 정보가 존재하지 않습니다.```";
        
    }
    else{
        result = lolutils.makeDiscordEmbed(nickname, summoner, summonertier, nicknametft, summonertfttier);
        
    }
    return result;
}


//롤 상태 보기
const getLolStatus = async () =>{
    

    let lolStatus = await lolutils.getLolStatus();
    
    return (lolutils.printLolStatus(lolStatus));
    
    

}
//인게임 정보 가져오기
const getLolIngame = async (command) => {
    
    let nickname = command.substring(command.indexOf(' ')+1);
    let summoner = await lolutils.getSummonerInfo(nickname);
    let ingame = await lolutils.getLolSpectator(summoner);

    if (summoner.response!=undefined && summoner.response.status===404){
        
        return ("```해당 소환사 정보가 존재하지 않습니다.```");
    } else if (ingame.response!=undefined && ingame.response.status===404){
        return ("```현재 게임중이 아닙니다.```");
    }
    else  {return lolutils.printInGame(ingame)};

    

}

const printHelp = () => {
    return("```로르봇 도움말\n\n명령어: *\n\n봇초대: 로르봇 초대 주소 알림\n\n**롤**\n롤상태: 롤서버의 상태를 보여줍니다.\n롤정보 [닉네임] : 소환사 정보를 보여줍니다,\n롤내전: 내전 팀 구성기를 보여줍니다.\n\n\n가위바위보 [가위/바위/보] : 컴퓨터와 가위바위보를 합니다.\n주사위 [최소숫자] [최대숫자]: 랜덤값을 보냅니다.\n비트코인 [비트코인종류(BTC/ETC/..)]: 비트코인 시세를 보여줍니다.```");
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
    getLoLInfo, getCoin,getLolStatus, printHelp, getLolIngame
};