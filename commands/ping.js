const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong! 🏓'),
  async execute(interaction) {
    await interaction.reply('Calculating ping...').then(() => {
      const latency = Date.now() - interaction.createdTimestamp;
      const apiLatency = Math.round(interaction.client.ws.ping);
      interaction.editReply(`🏓Pong! | Bot latency: ${latency}ms, API latency: ${apiLatency}ms`);
    });
  }
}