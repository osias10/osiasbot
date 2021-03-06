const os=require('os');
//const path = require("path");
const tmpdir = os.tmpdir();
const filename=`test.png`;
//const filepath = path.join(tmpdir,filename);
const {createCanvas,Image,loadImage}= require("canvas");
const fs=require("fs");
const { resolve } = require("path");
let filepath='./../files/test.png';
const emblemPath='./../files/lolFiles/ranked-emblems/';

/*
const bgColor=randomColor({
    luminosity:'dark',
});
*/



const rankToString = (rank) => rank && rank.length > 0 ? `${rank[0].tier} ${rank[0].rank} ${rank[0].leaguePoints}LP` : 'UnRanked';



async function makeLolStatusImg(nickname, summoner, summonertier, nicknametft, summonertfttier){

    const soloRank = summonerRank.filter(obj => obj['queueType'] === 'RANKED_SOLO_5x5');
    const summonerSoloRank = rankToString(soloRank);

    const flexRank = summonerRank.filter(obj => obj['queueType'] === 'RANKED_FLEX_SR');
    const summonerFlexRank = rankToString(flexRank);
    


    const summonerTFTRank = rankToString(summonerRankTft);

    let profileImgLink = `http://ddragon.leagueoflegends.com/cdn/11.5.1/img/profileicon/4561.png`;
            let soloRankImgLink=`https://opgg-static.akamaized.net/images/medals/default.png?image=q_auto:best&v=1`;
            const nickName="테스트 닉네임";
            
            //let profile_img=new Image();
            //profile_img.src=`http://ddragon.leagueoflegends.com/cdn/11.5.1/img/profileicon/4561.png`
            //profile_img=imgLoad(profileImgLink);
            let soloRank_icon = imgLoad(soloRankImgLink);

            let canvas = createCanvas(700,300);
                
            let ctx = canvas.getContext("2d");
            let prifile_size=100;
            ctx.fillStyle = "rgb(0, 0, 0, 0.5)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font='bold 15pt  Gulim';
            ctx.fillStyle = "white";
            ctx.fillText(nickName,150,50);
            
            drawText(ctx,"bold 12pt  Gulim",'white','솔로 랭크',308,105);
            drawText(ctx,"bold 12pt  Gulim",'white','자유 랭크',459,105);
            drawText(ctx,"bold 12pt  Gulim",'white','TFT 랭크',610,105);

            drawText(ctx,"bold 12pt  Gulim",'white','GOLD 5',310,230);
            drawText(ctx,"bold 12pt  Gulim",'white','PLATINUM 5',460,230);
            drawText(ctx,"bold 12pt  Gulim",'white','GOLD 5',610,230);

            drawText(ctx,"bold 12pt  Gulim",'white','3LP',310,248);
            drawText(ctx,"bold 12pt  Gulim",'white','3LP',460,248);
            drawText(ctx,"bold 12pt  Gulim",'white','3LP',610,248);

            /*
            profile_img.onload = function(){
                ctx.drawImage(profile_img,30, 30, 100, 100);
                ctx.drawImage(soloRank_icon,250,100,120,120);
                ctx.drawImage(imgLoad(soloRankImgLink),400,100,120,120);
                ctx.drawImage(imgLoad(soloRankImgLink),550,100,120,120);

            }
            */
           
    let profile_img= await loadImage(`http://ddragon.leagueoflegends.com/cdn/11.5.1/img/profileicon/${summonerInfo.profileIconId}.png`);
    
    ctx.drawImage(profile_img,30, 30, 100, 100);
    ctx.drawImage(await loadImage(`${emblemPath}${printTierEmblem(soloRank)}`),250,100,120,120);
    ctx.drawImage(await loadImage(`${emblemPath}${printTierEmblem(flexRank)}`),400,100,120,120);
    ctx.drawImage(await loadImage(`${emblemPath}${printTierEmblem(summonerRankTft)}`),550,100,120,120);

    const statusImgStream=canvas.createPNGStream();
    
    const statusImgOut = fs.createWriteStream(filepath);
    //console.log(filepath);
    statusImgStream.pipe(statusImgOut);

    statusImgOut.on("finish",()=>{
        resolve(filepath);
    });
    
    
    
                
}
async function imgLoad(imgLink){
    let img=new Image();
    img.src=imgLink;
    return img;
}
function drawText(ctx,textFont,color,text,x,y){
    ctx.textAlign='center';
    ctx.font=textFont;
    ctx.fillStyle = color;
    ctx.fillText(text,x,y);
}
function printTierEmblem(tier){
    if (tier[0]){
        switch (tier[0].tier){
            case "IRON" : return "Emblem_Iron";
            case "BRONZE" : return "Emblem_Bronze";
            case "SILVER" : return "Emblem_Silver" ;
            case "GOLD" : return "Emblem_Gold";
            case "PLATINUM" : return "Emblem_Platinum";
            case "DIAMOND" : return "Emblem_Diamond";
            case "MASTER" : return "Emblem_Master";
            case "GRANDMASTER" : return "Emblem_Grandmaster";
            case "CHALLENGER" : return "Emblem_Challenger";
            default : return "Emblem_Unranked";
        }
    }
    else return "Emblem_Unranked"
}

makeLolStatusImg();