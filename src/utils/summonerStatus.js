const os=require('os');
//const path = require("path");
const tmpdir = os.tmpdir();
const filename=`test.png`;
//const filepath = path.join(tmpdir,filename);
const {createCanvas,Image,loadImage}= require("canvas");
const fs=require("fs");
const { resolve } = require("path");
//const filepath='./src/files/tmp/';
//롤프로필 생성 임시파일 경로
const filepath='/ramdisk/';
const emblemPath='./src/files/lolFiles/ranked-emblems/';
const moment = require('moment');



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
            const textColor = 'white';
            let canvas = createCanvas(700,412);
                
            let ctx = canvas.getContext("2d");

            const tierLocation = 205;
            const fontKind = 'Nanum Gothic';

            let prifile_size=100;
            //ctx.fillStyle = "rgb(0, 0, 0, 0.5)";
            ctx.drawImage(await loadImage(backgroundImg),0,0,canvas.width,canvas.height);
        ctx.lineWidth=8;
        //ctx.strokeStyle="#e5e4e2";
        ctx.strokeStyle=selectColor(soloRank);
        ctx.strokeRect(0,0,canvas.width,canvas.height);


            //ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font='bold 15pt  Gulim';
            ctx.fillStyle = textColor;
            
            ctx.fillText(nickname,150,50);
            
            drawText(ctx,`bold 12pt  ${fontKind}`,textColor,'솔로 랭크',308,tierLocation);
            drawText(ctx,`bold 12pt  ${fontKind}`,textColor,'자유 랭크',459,tierLocation);
            drawText(ctx,`bold 12pt  ${fontKind}`,textColor,'TFT 랭크',610,tierLocation);

            drawText(ctx,`bold 12pt  ${fontKind}`,textColor,`${summonerSoloRank}`,310,tierLocation+125);
            drawText(ctx,`bold 12pt  ${fontKind}`,textColor,`${summonerFlexRank}`,460,tierLocation+125);
            drawText(ctx,`bold 12pt  ${fontKind}`,textColor,`${summonerTFTRank}`,610,tierLocation+125);

            drawText(ctx,`bold 12pt  ${fontKind}`,textColor,`${LPToString(soloRank)}`,310,tierLocation+143);
            drawText(ctx,`bold 12pt  ${fontKind}`,textColor,`${LPToString(flexRank)}`,460,tierLocation+143);
            drawText(ctx,`bold 12pt  ${fontKind}`,textColor,`${LPToString(summonerRankTft)}`,610,tierLocation+143);
            
            drawText(ctx,`bold 10pt  ${fontKind}`,textColor,`${printGameCounts(soloRank)}`,310,tierLocation+165);
            drawText(ctx,`bold 10pt  ${fontKind}`,textColor,`${printGameCounts(flexRank)}`,460,tierLocation+165);
            drawText(ctx,`bold 10pt  ${fontKind}`,textColor,`${printGameCounts(summonerRankTft)}`,610,tierLocation+165);

            drawText(ctx,`bold 10pt  ${fontKind}`,textColor,`${printGamePer(soloRank)}`,310,tierLocation+185);
            drawText(ctx,`bold 10pt  ${fontKind}`,textColor,`${printGamePer(flexRank)}`,460,tierLocation+185);
            drawText(ctx,`bold 10pt  ${fontKind}`,textColor,`${printGamePer(summonerRankTft)}`,610,tierLocation+185);
/*
            const textColor2='white'
            ctx.textAlign='left';
            ctx.font=` 15pt  ${fontKind}`;
            ctx.fillStyle = textColor2;
            
            ctx.fillText(nickname,150,50);
            
            drawText(ctx,`12pt  ${fontKind}`,textColor2,'솔로 랭크',308,tierLocation);
            drawText(ctx,` 12pt  ${fontKind}`,textColor2,'자유 랭크',459,tierLocation);
            drawText(ctx,` 12pt  ${fontKind}`,textColor2,'TFT 랭크',610,tierLocation);

            drawText(ctx,` 12pt  ${fontKind}`,textColor2,`${summonerSoloRank}`,310,tierLocation+125);
            drawText(ctx,` 12pt  ${fontKind}`,textColor2,`${summonerFlexRank}`,460,tierLocation+125);
            drawText(ctx,` 12pt  ${fontKind}`,textColor2,`${summonerTFTRank}`,610,tierLocation+125);

            drawText(ctx,` 12pt  ${fontKind}`,textColor2,`${LPToString(soloRank)}`,310,tierLocation+143);
            drawText(ctx,` 12pt  ${fontKind}`,textColor2,`${LPToString(flexRank)}`,460,tierLocation+143);
            drawText(ctx,` 12pt  ${fontKind}`,textColor2,`${LPToString(summonerRankTft)}`,610,tierLocation+143);
            
            drawText(ctx,` 10pt  ${fontKind}`,textColor2,`${printGameCounts(soloRank)}`,310,tierLocation+165);
            drawText(ctx,` 10pt  ${fontKind}`,textColor2,`${printGameCounts(flexRank)}`,460,tierLocation+165);
            drawText(ctx,` 10pt  ${fontKind}`,textColor2,`${printGameCounts(summonerRankTft)}`,610,tierLocation+165);

            drawText(ctx,` 10pt  ${fontKind}`,textColor2,`${printGamePer(soloRank)}`,310,tierLocation+185);
            drawText(ctx,` 10pt  ${fontKind}`,textColor2,`${printGamePer(flexRank)}`,460,tierLocation+185);
            drawText(ctx,` 10pt  ${fontKind}`,textColor2,`${printGamePer(summonerRankTft)}`,610,tierLocation+185);
            */

            /*
            profile_img.onload = function(){
                ctx.drawImage(profile_img,30, 30, 100, 100);
                ctx.drawImage(soloRank_icon,250,100,120,120);
                ctx.drawImage(imgLoad(soloRankImgLink),400,100,120,120);
                ctx.drawImage(imgLoad(soloRankImgLink),550,100,120,120);

            }
            */
    
    let profile_img= await loadImage(`http://ddragon.leagueoflegends.com/cdn/11.7.1/img/profileicon/${summonerInfo.profileIconId}.png`);
    
    ctx.drawImage(profile_img,30, 30, 100, 100);
    //프로필 사진 테두리
   

    ctx.lineWidth=3;
    //ctx.strokeStyle="#e5e4e2";
    ctx.strokeStyle=selectColor("soloRank");
    ctx.strokeRect(30,30,100,100);

     //레벨 표시 이미지
     ctx.drawImage(await loadImage('./src/files/lolFiles/level.png'),55, 115, 50, calImageSize(1056,612,50));
    drawText(ctx,`bold 12pt  ${fontKind}`,textColor,`${summonerInfo.summonerLevel}`,80,136)
    ctx.drawImage(await loadImage(`${emblemPath}${printTierEmblem(soloRank)}.png`),250,tierLocation-5,120,120);
    ctx.drawImage(await loadImage(`${emblemPath}${printTierEmblem(flexRank)}.png`),400,tierLocation-5,120,120);
    ctx.drawImage(await loadImage(`${emblemPath}${printTierEmblem(summonerRankTft)}.png`),550,tierLocation-5,120,120);

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
    const nowTime=moment().milliseconds();
    const buffer=canvas.toBuffer('image/png');
    const summonerInfoPath= `${filepath}${nickname}-${nowTime}.png`;
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
function calImageSize(width,height,resizeWidth){
    return ((resizeWidth*height)/width);
}
function selectColor(tier){
    if (tier[0]){
        switch(tier[0].tier){
            case "IRON" : return "#a19d94";
            case "BRONZE" : return "#cd7f32";
            case "SILVER" : return "#c0c0c0" ;
            case "GOLD" : return "#ffd700";
            case "PLATINUM" : return "#e5e4e2";
            case "DIAMOND" : return "#cfe4ee";
            case "MASTER" : return "#684d77";
            case "GRANDMASTER" : return "#e71837";
            case "CHALLENGER" : return "#87ceeb";
            default : return "#e5e4e2";

            
        }
    }
    else return '#e5e4e2';
}

module.exports={
    makeLolStatusImg
}