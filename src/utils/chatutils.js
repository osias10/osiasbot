function messageAnonymous(msg){
    let chat = msg.content.substring(1);
    msg.delete()
    .then (msg=> console.log(`익명채팅: [${msg.author.username}]\n 내용: ${msg.content}`))
    .catch(err => msg.channel.send("권한이 부족합니다"))
    
    msg.channel.send(`[익명채팅]\n${chat}`);
}

module.exports = {
    messageAnonymous
}