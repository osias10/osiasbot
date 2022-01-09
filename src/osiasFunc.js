const lolutils = require('./utils/lolutils');
const coinutils = require('./utils/coinutils');
const fs=require('fs');
const summonerImg= require('./utils/summonerStatus');
var os = require('os');

const tmpdir = os.tmpdir();
const summonerImgName=`test.png`;
//const filepath = path.join(tmpdir,summonerImgName);



const getLoLInfo = async (command) => {
    let result;
    let nickname = command.substring(command.indexOf(' ') + 1);
    
    let summoner = await lolutils.getSummonerInfo(nickname);
    let summonertier = await lolutils.getSummonerRank(summoner.id);
    let nicknametft = await lolutils.getSummonerInfoTft(nickname);
    let summonertfttier = await lolutils.getSummonerRankTft(nicknametft.id);
    
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
        
        return (["```해당 소환사 정보가 존재하지 않습니다.```"]);
    } else if (ingame.response!=undefined && ingame.response.status===404){
        return (["```현재 게임중이 아닙니다.```"]);
    }else  {
        const lolSpectatorFile = await lolutils.sendLolSpectator(ingame);
        const lolSpectatorPrint = await lolutils.printInGame(ingame);
        return ([lolSpectatorPrint,lolSpectatorFile]);
        
    };
}

const deleteSpectatorFile = async (fileName) =>{
    if (fileName!=undefined){
        fs.access(fileName,fs.constants.F_OK,(err)=>{
            if (err) return console.log("삭제할수 없는 파일입니다.");
        })
    
    
        fs.unlink(fileName,function(err){
            if(err) throw err;
            console.log(`${fileName} 삭제완료`);
        });
    }
    
}


const printHelp = () => {
    return("```로르봇 도움말\n\n명령어: *\n\n봇초대: 로르봇 초대 주소 알림\n\n**롤**\n롤상태: 롤서버의 상태를 보여줍니다.\n롤프로필 [닉네임] : 소환사 정보를 보여줍니다,\n롤관전 [닉네임] 현재 게임상황을 보여줍니다.\n롤내전: 내전 팀 구성기를 보여줍니다.\n\n\n가위바위보 [가위/바위/보] : 컴퓨터와 가위바위보를 합니다.\n주사위 [최소숫자] [최대숫자]: 랜덤값을 보냅니다.\n비트코인 [비트코인종류(BTC/ETC/..)]: 비트코인 시세를 보여줍니다.```");
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




const getLoLInfoImg = async (command) => {
    let result;
    let resultImg;
    let nickname = command.substring(command.indexOf(' ') + 1);
    /*
    let summoner = await lolutils.getSummonerInfo(nickname);
    let summonertier = await lolutils.getSummonerRank(summoner.id);
    let nicknametft = await lolutils.getSummonerInfoTft(nickname);
    let summonertfttier = await lolutils.getSummonerRankTft(nicknametft.id);
    let summonerChampion= await lolutils.getSummonerChampion(summoner.id);
    let championList = await lolutils.getChampionList();
    let championListFull= await lolutils.getChampionListFull();
    */
   let [summoner,nicknametft,championList,championListFull] = await Promise.all([lolutils.getSummonerInfo(nickname), lolutils.getSummonerInfoTft(nickname), lolutils.getChampionList(), lolutils.getChampionListFull()]);
   let [summonertier, summonertfttier, summonerChampion] = await Promise.all([lolutils.getSummonerRank(summoner.id), lolutils.getSummonerRankTft(nicknametft.id), lolutils.getSummonerChampion(summoner.id)]);

    


    if(summoner.response!=undefined && summoner.response.status===404){
        result = "```해당 소환사 정보가 존재하지 않습니다.```";
        
    }
    else{
        /*

        statusImgStream = summonerImg.makeLolStatusImg(nickname, summoner, summonertier, nicknametft, summonertfttier);
        const statusImgOut = fs.createWriteStream(filepath);
        console.log(filepath);
        statusImgStream.pipe(statusImgOut);
        */
        resultImg= await summonerImg.makeLolStatusImg(nickname, summoner, summonertier, nicknametft, summonertfttier,summonerChampion,championList,championListFull);
        
    }
    return [result,resultImg,[summoner,summonertier,summonertfttier,summonerChampion]];
}

const getLolIngameImg = async (command) => {
    
    let nickname = command.substring(command.indexOf(' ')+1);
    let summoner = await lolutils.getSummonerInfo(nickname);
    let ingame = await lolutils.getLolSpectator(summoner);

    if (summoner.response!=undefined && summoner.response.status===404){
        
        return (["```해당 소환사 정보가 존재하지 않습니다.```"]);
    } else if (ingame.response!=undefined && ingame.response.status===404){
        return (["```현재 게임중이 아닙니다.```"]);
    }else  {
        const lolSpectatorFile = await lolutils.sendLolSpectator(ingame);
        const lolSpectatorPrint = await summonerImg.makeInGameImg(nickname,ingame);
        return ([lolSpectatorPrint,lolSpectatorFile]);
        
    };
}

module.exports = {
    getLoLInfo, getCoin,getLolStatus, printHelp, getLolIngame, deleteSpectatorFile, getLoLInfoImg, getLolIngameImg
};