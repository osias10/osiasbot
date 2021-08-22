const {Covid19} = require('./../../api_key.json');
const moment = require('moment');

const axios = require('axios');
const xml2js = require('xml2js');

const util = require('util');
const parse = util.promisify(xml2js.parseString);


/*
const getcovid19= async()=>

    await axios.get(`http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson?serviceKey=${Covid19}&pageNo=1&numOfRows=10&startCreateDt=20210813&endCreateDt=20210814`)
    .then(res=>res.data)
    .catch(err =>err)
*/

async function commandKind(command){
    //const command2 = command.substring(command.indexOf(' ') + 1);
    const command2 = command[1]
    console.log(command2);
    if (command2){
        if (command2.startsWith('백신')){
            return(await printCovid19Vaccine());
        }
        
    }
    else{
        return (await printCovid19());
    }

}

async function getcovid19(){
    const today = moment().format("YYYYMMDD");
    const yesterday = moment().subtract(1,'days').format("YYYYMMDD");
    const res = await axios.get(`http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson?serviceKey=${Covid19}&pageNo=1&numOfRows=10&startCreateDt=${yesterday}&endCreateDt=${today}`);
    return res;
}

async function printCovid19(){
    const data = await getcovid19();
    const today = moment().format("YYYY-MM-DD");
    const data2 = data.data.response.body.items.item;
    const decideCnt = data2[0].decideCnt - data2[1].decideCnt;
    return (`[${today}] 코로나19 확진자수\n${decideCnt.toLocaleString()} 명`);
}

//코로나19 예방접종 현황
async function getcovid19Vaccine(){
    const res = await axios.get(`https://nip.kdca.go.kr/irgd/cov19stats.do?list=all`);
    return res;
}
async function printCovid19Vaccine(){
    const data = await getcovid19Vaccine();
    const parseData = await parse(data.data);
    const today = parseData.response.body[0].dataTime;
    //당일실적 1차 접종
    const todayVaccine1 = Number(parseData.response.body[0].items[0].item[0].firstCnt);
    //당일실적 2차접종
    const todayVaccine2 = Number(parseData.response.body[0].items[0].item[0].secondCnt);
    //전체접종 1차
    const AllVaccine1 = Number(parseData.response.body[0].items[0].item[2].firstCnt);
    const AllVaccine2 = Number(parseData.response.body[0].items[0].item[2].secondCnt);

    return (`코로나 19 예방접종 현황 \t\t[${today}]\n[오늘 접종한 인원]\n1차 접종: ${todayVaccine1.toLocaleString()}\t2차 접종: ${todayVaccine2.toLocaleString()}\n[총 접종자 수]\n1차 접종: ${AllVaccine1.toLocaleString()}  (${(AllVaccine1/51710000*100).toLocaleString()}%)\t2차 접종: ${AllVaccine2.toLocaleString()}  (${(AllVaccine2/51710000*100).toLocaleString()}%)`);

}


module.exports = {
    commandKind
}