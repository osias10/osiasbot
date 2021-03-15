const Discord = require('discord.js');
const minigame = require('./utils/minigame');
const osiasFunc = require('./osiasFunc');

const {
  DISCORD_KEY
} = require('./../key.json');

const commandLetter = '*';

const client = new Discord.Client();
client.on('ready', () => console.log('준비 완료!'));
client.on('message', async msg => {
  let content = msg.content;
  if (content === 'ping') {
    msg.reply(`🏓 pong! \`API 지연시간: ${Math.floor(client.ws.ping)}ms\``);
  }

  if (!content.startsWith(commandLetter)) {
    return;
  }

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
  } else if(command.startsWith('롤상태')){
    msg.channel.send(await osiasFunc.getLolStatus(command));
  } else if(command.startsWith('관전')){
    
  } else if(command.startsWith('봇초대' ||'초대')){
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
});

client.login(DISCORD_KEY);