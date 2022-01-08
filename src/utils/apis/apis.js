const express = require('express');
const app = express();
const router = express.Router();
const osiasFunc = require('../../osiasFunc');
const axios = require('axios');
const {IMGBB_KEY} = require('./../../../key.json')
const fs=require('fs');
const FormData = require("form-data");

router.get('/summonerImg', async function(req, res){

    let nickname = req.query.nickname;
    const summonerImg=await osiasFunc.getLoLInfoImg(nickname);
    if (summonerImg[1]!=undefined){
      let ImgURL = await uploadImgbb(summonerImg[1])
      //console.log(ImgURL);
      if (ImgURL.status == 200){
        return res.json({"data":{"ImgURL":ImgURL.data.data.display_url, "summonertier":printTier(summonerImg[2][0],summonerImg[2][1]) , "summonerChampion" : summonerImg[2][2]}});
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

module.exports = router;
