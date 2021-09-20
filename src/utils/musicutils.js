const ytdl = require("ytdl-core");


const queue = new Map();

async function playSong(msg, serverQueue){
    const commandList = msg.content.trim().split(/ +/);

    const voiceChannel =  msg.member.voice.channel
    if(!voiceChannel){
        return msg.channel.send("실행하려면 음성채널에 들어가 주세용");

    }

    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return msg.channel.send("Speak 권한과 voice channel 입장 권한이 필요해요!");
    }
    const songInfo = await ytdl.getInfo(commandList[1]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    
    };

    if (!serverQueue){

    }else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return msg.channel.send(`${song.title} 이 대기열에 추가되었습니다.`);
    }
    const queueContruct = {
        textChannel: msg.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
    };
    queue.set(msg.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try{
        let connection = await voiceChannel.join();
        queueContruct.connection = connection;
        play(msg.guild, queueContruct.songs[0]);
        
    } catch ( err) {
        console.log(err);
        queue.delete(msg.guild.id);
        return msg.channel.send(err);
    }


}

function play(guild,song){
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
      }
      const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    if (!serverQueue)
      return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
  }

  function stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }

module.exports = {
    playSong,
    skip,
    stop,
    play
  }