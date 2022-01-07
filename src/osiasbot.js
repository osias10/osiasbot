//const Discord = require('discord.js');

const { Client, Intents } = require('discord.js');
const minigame = require('./utils/minigame');
const osiasFunc = require('./osiasFunc');
const chatutils = require('./utils/chatutils');
const lolutils = require('./utils/lolutils');
const apiuilts = require('./utils/apiutils');
const amongus = require('./utils/amongus');
const musicutils = require('./utils/musicutils');
const chatbuttons = require('./utils/chatbuttons');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const router = require('./utils/apis/apis');



const {
  DISCORD_KEY
} = require('./../key.json');

const commandLetter = '*';

//const getlolLatestVersion =  lolutils.getLolVersion().then(res => res.data);
//getlolLatestVersion =  await lolutils.getLolVersion()
//const lolLatestVersion = getlolLatestVersion[0];
//console.log(getlolLatestVersion);
//global.getlolLatestVersion=getlolLatestVersion;

//const client = new Discord.Client();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]  });

const queue = new Map();

//client.on('ready', () => console.log('준비 완료!'));
client.on('ready', async() => {
  getlolLatestVersion =  await lolutils.getLolVersion()
  const lolLatestVersion = getlolLatestVersion[0];
  global.lolLatestVersion=lolLatestVersion;
  console.log("최신버전: "+lolLatestVersion);
  
  const championFace = `http://ddragon.leagueoflegends.com/cdn/${lolLatestVersion}/img/champion/`
  const spellImg = `http://ddragon.leagueoflegends.com/cdn/${lolLatestVersion}/img/spell/`
  global.championFace = championFace;
  
  global.spellImg = spellImg;






});
client.on('message', async msg => {

  

  let content = msg.content;
  if (content === 'ping') {
    msg.reply(`🏓 pong! \`API 지연시간: ${Math.floor(client.ws.ping)}ms\``);
  }

  if (!content.startsWith(commandLetter)) {
    return;
  }


  const serverQueue = queue.get(msg.guild.id);


  const command = content.trim().substring(1);
  console.log('command: ' + command);
  const commandList = command.trim().split(/ +/);

  if (command.startsWith('dice') || command.startsWith('주사위')) {
    msg.reply(minigame.dice(commandList));
  } else if (command.startsWith('help') || command.startsWith('봇안내')){
    msg.channel.send(osiasFunc.printHelp());
  } else if (command.startsWith('가위바위보')) {
    msg.reply(minigame.rockPaperScissors(msg.author.username, commandList[1]));
  } else if (command.startsWith('롤내전')) {
    msg.reply(`https://lolbalance.osias.duckdns.org`);
  } else if (command.startsWith('롤정보')) {
    msg.channel.send(await osiasFunc.getLoLInfo(command));
  } else if(command.startsWith('롤프로필')){
    const summonerImg=await osiasFunc.getLoLInfoImg(command);
    if (summonerImg[1]!=undefined){
      await msg.channel.send({files:[summonerImg[1]]});
      console.log(summonerImg);
    }
    else{
      msg.channel.send(summonerImg[0]);
    }
    osiasFunc.deleteSpectatorFile(summonerImg[1]);
    
  } else if(command.startsWith('롤상태')||command.startsWith('롤서버')){
    msg.channel.send(await osiasFunc.getLolStatus(command));
  } else if(command.startsWith('롤관전')){
    const lolIngame = (await osiasFunc.getLolIngame(command))
    //await msg.channel.send(`${lolIngame[0]}`,{files:[lolIngame[1]]});
    //let embed = lolIngame[0];
    //await msg.channel.send({embed,files:[lolIngame[1]]});
    await msg.channel.send(lolIngame[0]);
    if (lolIngame[1]!=undefined) {await msg.channel.send({files:[lolIngame[1]]});}
    
    osiasFunc.deleteSpectatorFile(lolIngame[1]);
    
  } 
  else if (command.startsWith('관전')){
    const lolIngameImg= await osiasFunc.getLolIngameImg(command);

    if (lolIngameImg[1]!= undefined){
      await msg.channel.send('',{files:[lolIngameImg[0]]});
      await msg.channel.send({files:[lolIngameImg[1]]});

      try{
        await osiasFunc.deleteSpectatorFile(lolIngameImg[0]);
        await osiasFunc.deleteSpectatorFile(lolIngameImg[1]);
      }
      catch{
        console.log("파일 삭제 실패");
      }
    }
    else {
      msg.channel.send(lolIngameImg[0]);
    }
    


  }
  
  else if(command.startsWith('봇초대' ||'초대')){
    msg.channel.send("https://discord.com/oauth2/authorize?client_id=710395761682153533&permissions=8&scope=bot");
  } else if (command.startsWith('바보')) {
    let name = commandList[1];
    if (name) {
      msg.channel.send(`${name}바보\n포항항ꉂꉂ(ᵔᗜᵔ)ㅋㅋㅋㅋ:cruise_ship::ocean:`);
    } else {
      msg.channel.send(`${msg.guild.member(msg.author).displayName} 바보\n포항항ꉂꉂ(ᵔᗜᵔ)ㅋㅋㅋㅋ:cruise_ship::ocean:`);
    }
  } else if (command.startsWith('비트코인')) {
    msg.reply(await osiasFunc.getCoin(commandList));
  } else if (command.startsWith('플레')) {
    msg.reply('<:Platinium:818816782088798239>');
  }
  else if (command.startsWith('익명')){
    chatutils.messageAnonymous(msg);

  }
  else if (command.startsWith('코로나')){
    msg.channel.send(await apiuilts.commandKind(commandList));
  }
  else if (command.startsWith('어몽어스')){
    const among = amongus.amongus(commandList);
    if (among[1]){
      await msg.channel.send({files:[among[1]]});
    }
    else {
      msg.channel.send(among[0]);
    }
  }
  else if (command.startsWith('random')){
    chatutils.random(msg);
  }
  
});

client.on('interactionCreate', async (interaction) => {

  if (interaction.isButton()){
    chatbuttons.randomResultInteraction(interaction);
  }

});


client.login(DISCORD_KEY);


app.listen(10002, function () {
  console.log('CORS-enabled web server listening on port 10002')
})

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extends:true}));
app.use(cors())
app.set('view engine', 'ejs');
app.use(router)


/*
module.exports={
  
  "lolLatestVersion" : lolLatestVersion
}
*/