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
        return res.json({"data":{"ImgURL":ImgURL.data.data.display_url}});
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


module.exports = router;
