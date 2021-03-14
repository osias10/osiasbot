const axios = require('axios');
const urlencode = require('urlencode');

const getUpbit = async (coin) =>
  await axios.get(`https://crix-api-endpoint.upbit.com/v1/crix/candles/days/?code=CRIX.UPBIT.KRW-${urlencode(coin)}`)
  .then(res => res.data[0])
  .then(res => `업비트\t\t\t${res['tradePrice']}\t\t\t\t\t\t${res['changePrice']}\n`)
  .catch(err => '업비트\t\t\t\t해당 코인정보가 존재하지 않습니다.');

module.exports = {
  getUpbit
};