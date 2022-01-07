const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { RANDOM_BUTTON_ID, BUTTON_DISABLE } = require('../config/config');


function randomResultInteraction(interaction){

    const collector = interaction.channel.createMessageComponentCollector({
        filter: (i) => i.customId.startsWith(`${RANDOM_BUTTON_ID}`),
        time: 20000
    });

    collector.on('collect', async(i) => {
        console.log(i);
        if ( i.customId.startsWith(`${RANDOM_BUTTON_ID}`)) {
            const row = new MessageActionRow;

            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('**랜덤 결과!**')
                .setDescription('당첨자는')
                .addField('**당첨자**','따란')
                .addField('**미당첨**','메롱')
                .setTimestamp();
                
            const button = new MessageButton()
                .setCustomId(`${BUTTON_DISABLE}`)
                .setLabel('Result')
                .setStyle('PRIMARY')
                .setDisabled(true);

            row.addComponents(button);
            try{
                await i.deferUpdate();
                await i.editReply({ embeds: [embed], components: [row]});
            }
            catch (e){
                console.log(e);
            }
        }
    })

}

module.exports = {
    randomResultInteraction
}