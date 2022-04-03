const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription("Replies with the bot's uptime"),
  async execute(interaction) {
    const isNotDM = interaction.guild === null ? false : true
    let totalSeconds = (interaction.client.uptime / 1000);

    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;

    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;

    let minutes = Math.floor(totalSeconds / 60);

    let seconds = Math.floor(totalSeconds % 60);

    const msg = new MessageEmbed()
      .setColor('GREEN')
      .addFields(
        {
          name: "Uptime",
          value: `\`${days}\` days, \`${hours}\` hours, \`${minutes}\` minutes and \`${seconds}\` seconds`
        }
      )
    await interaction.reply({ embeds: [msg], ephemeral: isNotDM });
  }
}