const express = require('express');
const app = express();
const router = express.Router();
const osiasFunc = require('../../osiasFunc');
const axios = require('axios');
const {IMGBB_KEY} = require('./../../../key.json')
const fs=require('fs');
const FormData = require("form-data");
const lolutils = require('../lolutils');


router.get('/summonerImg', async function(req, res){
    let nickname = req.query.nickname;
    const summonerImg=await osiasFunc.getLoLInfoImg(nickname);
    if (summonerImg[1]!=undefined){
      let ImgURL = await uploadImgbb(summonerImg[1])
      //console.log(ImgURL);
      if (ImgURL.status == 200){
        return res.json({"data":{"ImgURL":ImgURL.data.data.display_url, "summonerInfo": printSummoner(summonerImg[2][0]), "summonertier":printTier(summonerImg[2][1],summonerImg[2][2]) , "summonerChampion" : printMost(summonerImg[2][3])}});
      }
      else{
        return res.json({"data":"ImageError"});
      }
    }
    else{
      return res.json({"data":"NotFound"});
    }

});

async function uploadImgbb(img){
  
  let imageAsBase64 = fs.readFileSync(img, 'base64');


  let form = new FormData();

  form.append('key',IMGBB_KEY);
  form.append('expiration',18000);
  form.append('image',imageAsBase64);
  
  let res =await axios({
    method: 'post',
    url: 'https://api.imgbb.com/1/upload',
    data: form,
    headers: {
      'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
      },
  })
  .catch((err)=>{
    console.log(err);
    console.log(err.response.data);
  });
  
  //console.log(res.data);
  return (res);
}

const rankToString = (rank) => rank && rank.length > 0 ? `${rank[0].tier} ${rank[0].rank}` : 'UnRanked';
const LPToString = (rank) => rank && rank.length > 0 ? `${rank[0].leaguePoints}LP` : '';


function printTier(summonerRank,tftRank){
  
  let soloRank = summonerRank.filter(obj => obj['queueType'] === 'RANKED_SOLO_5x5');
  let flexRank = summonerRank.filter(obj => obj['queueType'] === 'RANKED_FLEX_SR');
  let tftRankTier = tftRank.filter(obj => obj['queueType'] === 'RANKED_TFT');
  return([tierJson(soloRank,"솔로 랭크"),  tierJson(flexRank,"자유 랭크"), tierJson(tftRankTier,"TFT 랭크")]);
  

}

function tierJson(tier,queueType){
  if (tier.length==1){
    return({
      "queueType" : queueType,
      "tier" : rankToString(tier)+" "+LPToString(tier),
      "winrate" : printGameCounts(tier)
    })
  }
  else{
    return({
      "queueType" : queueType,
      "tier" : "unRanked"
    })
  }
}

function printGameCounts(Rank){
  if (Rank[0]){
      //return `${Rank[0].wins+Rank[0].losses}전 ${Rank[0].wins}승 ${Rank[0].losses}패 ${((Rank[0].wins/(Rank[0].wins+Rank[0].losses)*100).toFixed())}%`;
      return `${Rank[0].wins}승 ${Rank[0].losses}패 ${((Rank[0].wins/(Rank[0].wins+Rank[0].losses)*100).toFixed())}%`;

  }
  else return "";
}

function printSummoner(summoner){
  return({
    "nickname" : summoner.name,
    "profileIcon" : `http://ddragon.leagueoflegends.com/cdn/${lolLatestVersion}/img/profileicon/${summoner.profileIconId}.png`,
    "summonerLevel": summoner.summonerLevel
  })
}

function printMost(summonerChampion){
  //const championList = lolutils.getChampionList();
  printMost=[]
  for (let i=0; i<3; i++){

    
    printMost.push({
      "championId" : summonerChampion[i].championId,
      "championName" : championIdtoName(summonerChampion[i].championId),
      "championLevel" : summonerChampion[i].championLevel,
      "championPoints" : summonerChampion[i].championPoints
    });
  }
  
  return printMost;
}

function championIdtoName(id){
  for (let i in allchampionList.data){
    
    if (allchampionList.data[i].key== id){
      return (allchampionList.data[i].name);
    }
  }
}

module.exports = router;
