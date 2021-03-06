const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong! ๐'),
  async execute(interaction) {
    const isNotDM = interaction.guild === null ? false : true
    await interaction.reply({ content: 'Calculating ping...', ephemeral: isNotDM }).then(() => {
      const latency = Date.now() - interaction.createdTimestamp;
      const apiLatency = Math.round(interaction.client.ws.ping);
      interaction.editReply({ content: `๐Pong! | Bot latency: ${latency}ms, API latency: ${apiLatency}ms`, ephemeral: isNotDM });
    });
  }
}