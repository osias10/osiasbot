const { MessageActionRow, MessageButton, MessageEmbed} = require('discord.js');
const {RANDOM_BUTTON_ID} = require('./../config/config.js');


//익명채팅(기존 채팅 지우고 전송)
function messageAnonymous(msg){
    let chat = msg.content.substring(3);
    msg.delete()
    .then (msg=> console.log(`익명채팅: [${msg.author.username}]\n 내용: ${msg.content}`))
    .catch(err => msg.channel.send("권한이 부족합니다"))
    
    msg.channel.send(`[익명채팅]\n${chat}`);
}


//랜덤 버튼 만들기
function random(msg){
    const user = msg.mentions.users;
    console.log(msg);

    const button = new MessageButton()
        .setCustomId(`${RANDOM_BUTTON_ID}`)
        .setLabel('Open')
        .setStyle('SUCCESS');
    const row = new MessageActionRow().addComponents(button);
    const embed = new MessageEmbed().setColor('#0099ff').setTitle('Open Result!!');

    msg.channel.send({components: [row], embeds: [embed]});

}





module.exports = {
    messageAnonymous,
    random
}