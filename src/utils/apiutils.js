const {Covid19} = require('./../../api_key.json');
const moment = require('moment');

const axios = require('axios');
const convert = require('xml2js');
/*
const getcovid19= async()=>

    await axios.get(`http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson?serviceKey=${Covid19}&pageNo=1&numOfRows=10&startCreateDt=20210813&endCreateDt=20210814`)
    .then(res=>res.data)
    .catch(err =>err)
*/

async function getcovid19(){
    const today = moment().format("YYYYMMDD");
    const yesterday = moment().subtract(1,'days').format("YYYYMMDD");
    const res = await axios.get(`http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson?serviceKey=${Covid19}&pageNo=1&numOfRows=10&startCreateDt=${yesterday}&endCreateDt=${today}`);
    return res;
}

async function printCoivd19(){
    const data = await getcovid19();
    const today = moment().format("YYYY-MM-DD");
    const data2 = data.data.response.body.items.item;
    const decideCnt = data2[0].decideCnt - data2[1].decideCnt;
    return (`[${today}] 코로나19 확진자수\n${decideCnt.toLocaleString()} 명`);
}


module.exports = {
    printCoivd19
}