const os=require('os');
//const path = require("path");
const tmpdir = os.tmpdir();
const filename=`test.png`;
//const filepath = path.join(tmpdir,filename);
const {createCanvas,Image,loadImage}= require("canvas");
const fs=require("fs");
const { resolve } = require("path");
const filepath='./src/files/tmp/';
const emblemPath='./src/files/lolFiles/ranked-emblems/';

/*
const bgColor=randomColor({
    luminosity:'dark',
});
*/



const rankToString = (rank) => rank && rank.length > 0 ? `${rank[0].tier} ${rank[0].rank}` : 'UnRanked';
const LPToString = (rank) => rank && rank.length > 0 ? `${rank[0].leaguePoints}LP` : '';



async function makeLolStatusImg(nickname, summonerInfo, summonerRank, summonerInfoTft, summonerRankTft,summonerChampion,championList,championListFull){

    const soloRank = summonerRank.filter(obj => obj['queueType'] === 'RANKED_SOLO_5x5');
    const summonerSoloRank = rankToString(soloRank);

    const flexRank = summonerRank.filter(obj => obj['queueType'] === 'RANKED_FLEX_SR');
    const summonerFlexRank = rankToString(flexRank);
    


    const summonerTFTRank = rankToString(summonerRankTft);

    //const summonerMost1Id=summonerChampion[0].championId;
    //const champions=Object.values(championList.data);
    //const summonerMost1C = champions.filter(obj=>obj['key']===String(summonerMost1Id));
    const summonerMost1Id=summonerChampion[0].championId;
    const champions=Object.values(championListFull.data);
    const summonerMost1C = champions.filter(obj=>obj['key']===String(summonerMost1Id));
    
    const skinList=(summonerMost1C[0].skins).length;
    const randomSkin=getRandomInt(0,skinList);
    const backgroundSkin= summonerMost1C[0].skins[randomSkin].num;
    console.log(backgroundSkin);
    
    

    let profileImgLink = `http://ddragon.leagueoflegends.com/cdn/11.5.1/img/profileicon/4561.png`;
            let soloRankImgLink=`https://opgg-static.akamaized.net/images/medals/default.png?image=q_auto:best&v=1`;
            //const nickName="테스트 닉네임";
            const backgroundImg=`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${summonerMost1C[0].id}_${backgroundSkin}.jpg`;
            //let profile_img=new Image();
            //profile_img.src=`http://ddragon.leagueoflegends.com/cdn/11.5.1/img/profileicon/4561.png`
            //profile_img=imgLoad(profileImgLink);
            let soloRank_icon = imgLoad(soloRankImgLink);
            const textColor = 'black';
            let canvas = createCanvas(700,412);
                
            let ctx = canvas.getContext("2d");
            let prifile_size=100;
            //ctx.fillStyle = "rgb(0, 0, 0, 0.5)";
            ctx.drawImage(await loadImage(backgroundImg),0,0,canvas.width,canvas.height);
            //ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font='bold 15pt  Gulim';
            ctx.fillStyle = textColor;
            
            ctx.fillText(nickname,150,50);
            
            drawText(ctx,"bold 12pt  Gulim",textColor,'솔로 랭크',308,105);
            drawText(ctx,"bold 12pt  Gulim",textColor,'자유 랭크',459,105);
            drawText(ctx,"bold 12pt  Gulim",textColor,'TFT 랭크',610,105);

            drawText(ctx,"bold 12pt  Gulim",textColor,`${summonerSoloRank}`,310,230);
            drawText(ctx,"bold 12pt  Gulim",textColor,`${summonerFlexRank}`,460,230);
            drawText(ctx,"bold 12pt  Gulim",textColor,`${summonerTFTRank}`,610,230);

            drawText(ctx,"bold 12pt  Gulim",textColor,`${LPToString(soloRank)}`,310,248);
            drawText(ctx,"bold 12pt  Gulim",textColor,`${LPToString(flexRank)}`,460,248);
            drawText(ctx,"bold 12pt  Gulim",textColor,`${LPToString(summonerRankTft)}`,610,248);
            
            drawText(ctx,"bold 10pt  Gulim",textColor,`${printGameCounts(soloRank)}`,310,270);
            drawText(ctx,"bold 10pt  Gulim",textColor,`${printGameCounts(flexRank)}`,460,270);
            drawText(ctx,"bold 10pt  Gulim",textColor,`${printGameCounts(summonerRankTft)}`,610,270);

            drawText(ctx,"bold 10pt  Gulim",textColor,`${printGamePer(soloRank)}`,310,290);
            drawText(ctx,"bold 10pt  Gulim",textColor,`${printGamePer(flexRank)}`,460,290);
            drawText(ctx,"bold 10pt  Gulim",textColor,`${printGamePer(summonerRankTft)}`,610,290);

            const textColor2='white'
            ctx.textAlign='left';
            ctx.font=' 15pt  Gulim';
            ctx.fillStyle = textColor2;
            
            ctx.fillText(nickname,150,50);
            
            drawText(ctx,"12pt  Gulim",textColor2,'솔로 랭크',308,105);
            drawText(ctx," 12pt  Gulim",textColor2,'자유 랭크',459,105);
            drawText(ctx," 12pt  Gulim",textColor2,'TFT 랭크',610,105);

            drawText(ctx," 12pt  Gulim",textColor2,`${summonerSoloRank}`,310,230);
            drawText(ctx," 12pt  Gulim",textColor2,`${summonerFlexRank}`,460,230);
            drawText(ctx," 12pt  Gulim",textColor2,`${summonerTFTRank}`,610,230);

            drawText(ctx," 12pt  Gulim",textColor2,`${LPToString(soloRank)}`,310,248);
            drawText(ctx," 12pt  Gulim",textColor2,`${LPToString(flexRank)}`,460,248);
            drawText(ctx," 12pt  Gulim",textColor2,`${LPToString(summonerRankTft)}`,610,248);
            
            drawText(ctx," 10pt  Gulim",textColor2,`${printGameCounts(soloRank)}`,310,270);
            drawText(ctx," 10pt  Gulim",textColor2,`${printGameCounts(flexRank)}`,460,270);
            drawText(ctx," 10pt  Gulim",textColor2,`${printGameCounts(summonerRankTft)}`,610,270);

            drawText(ctx," 10pt  Gulim",textColor2,`${printGamePer(soloRank)}`,310,290);
            drawText(ctx," 10pt  Gulim",textColor2,`${printGamePer(flexRank)}`,460,290);
            drawText(ctx," 10pt  Gulim",textColor2,`${printGamePer(summonerRankTft)}`,610,290);
            

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
    const summonerInfoPath= `${filepath}${nickname}.png`
    fs.writeFileSync(summonerInfoPath,buffer);
    return (summonerInfoPath);
    
                
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
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

module.exports={
    makeLolStatusImg
}