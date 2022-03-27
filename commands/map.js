const { SlashCommandBuilder } = require('@discordjs/builders');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('map')
    .setDescription('The University Map'),
  async execute(interaction) {
    await interaction.reply({ files: [path.join(__dirname, '../images/campus_map.jpg')] });
  }
}