const os=require('os');
//const path = require("path");
const tmpdir = os.tmpdir();
const filename=`test.png`;
//const filepath = path.join(tmpdir,filename);
const {createCanvas,Image,loadImage}= require("canvas");
const fs=require("fs");
const { resolve } = require("path");
const filepath='./src/files/tmp/test.png';
const emblemPath='./src/files/lolFiles/ranked-emblems/';

/*
const bgColor=randomColor({
    luminosity:'dark',
});
*/



const rankToString = (rank) => rank && rank.length > 0 ? `${rank[0].tier} ${rank[0].rank}` : 'UnRanked';
const LPToString = (rank) => rank && rank.length > 0 ? `${rank[0].leaguePoints}LP` : '';



async function makeLolStatusImg(nickname, summonerInfo, summonerRank, summonerInfoTft, summonerRankTft){

    const soloRank = summonerRank.filter(obj => obj['queueType'] === 'RANKED_SOLO_5x5');
    const summonerSoloRank = rankToString(soloRank);

    const flexRank = summonerRank.filter(obj => obj['queueType'] === 'RANKED_FLEX_SR');
    const summonerFlexRank = rankToString(flexRank);
    


    const summonerTFTRank = rankToString(summonerRankTft);

    let profileImgLink = `http://ddragon.leagueoflegends.com/cdn/11.5.1/img/profileicon/4561.png`;
            let soloRankImgLink=`https://opgg-static.akamaized.net/images/medals/default.png?image=q_auto:best&v=1`;
            //const nickName="테스트 닉네임";
            
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
            ctx.fillText(nickname,150,50);
            
            drawText(ctx,"bold 12pt  Gulim",'white','솔로 랭크',308,105);
            drawText(ctx,"bold 12pt  Gulim",'white','자유 랭크',459,105);
            drawText(ctx,"bold 12pt  Gulim",'white','TFT 랭크',610,105);

            drawText(ctx,"bold 12pt  Gulim",'white',`${summonerSoloRank}`,310,230);
            drawText(ctx,"bold 12pt  Gulim",'white',`${summonerFlexRank}`,460,230);
            drawText(ctx,"bold 12pt  Gulim",'white',`${summonerTFTRank}`,610,230);

            drawText(ctx,"bold 12pt  Gulim",'white',`${LPToString(soloRank)}`,310,248);
            drawText(ctx,"bold 12pt  Gulim",'white',`${LPToString(flexRank)}`,460,248);
            drawText(ctx,"bold 12pt  Gulim",'white',`${LPToString(summonerRankTft)}`,610,248);
            
            drawText(ctx,"bold 10pt  Gulim",'white',`${printGameCounts(soloRank)}`,310,270);
            drawText(ctx,"bold 10pt  Gulim",'white',`${printGameCounts(flexRank)}`,460,270);
            drawText(ctx,"bold 10pt  Gulim",'white',`${printGameCounts(summonerRankTft)}`,610,270);

            drawText(ctx,"bold 10pt  Gulim",'white',`${printGamePer(soloRank)}`,310,290);
            drawText(ctx,"bold 10pt  Gulim",'white',`${printGamePer(flexRank)}`,460,290);
            drawText(ctx,"bold 10pt  Gulim",'white',`${printGamePer(summonerRankTft)}`,610,290);

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
    ctx.drawImage(await loadImage(`${emblemPath}${printTierEmblem(soloRank)}.png`),250,100,120,120);
    ctx.drawImage(await loadImage(`${emblemPath}${printTierEmblem(flexRank)}.png`),400,100,120,120);
    ctx.drawImage(await loadImage(`${emblemPath}${printTierEmblem(summonerRankTft)}.png`),550,100,120,120);

    /*
    const statusImgStream=canvas.createPNGStream();
    
    const statusImgOut = fs.createWriteStream(filepath);
    //console.log(filepath);
    statusImgStream.pipe(statusImgOut);
    */

    /*
    statusImgOut.on("finish",()=>{
        //resolve(filepath);
    
    });
    */
   
    const buffer=canvas.toBuffer('image/png');
    fs.writeFileSync(filepath,buffer);
    return (filepath);
    
                
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
};

function printGameCounts(Rank){
    if (Rank[0]){
        //return `${Rank[0].wins+Rank[0].losses}전 ${Rank[0].wins}승 ${Rank[0].losses}패 ${((Rank[0].wins/(Rank[0].wins+Rank[0].losses)*100).toFixed())}%`;
        return `${Rank[0].wins}승 ${Rank[0].losses}패`;

    }
    else return "";
}
function printGamePer(Rank){
    if (Rank[0]){
        return `${((Rank[0].wins/(Rank[0].wins+Rank[0].losses)*100).toFixed())}%`;
    }
    else return "";
}
module.exports={
    makeLolStatusImg
}