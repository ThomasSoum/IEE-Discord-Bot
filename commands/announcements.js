const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const mongo = require('../databases/mongo');
const serverSettingsSchema = require('../schemas/server-settings-schema');

module.exports = {
  permission: 'ADMINISTRATOR',
  serverOnly: true,
  data: new SlashCommandBuilder()
    .setName('announcements')
    .setDescription('Enable/Disable announcement updates on the server')
    .addStringOption((option) => option
      .setName('option')
      .setDescription('Whether or not you want the server to receive announcement updates')
      .setRequired(true)
      .addChoice('ON', 'true')
      .addChoice('OFF', 'false')
    ),
  async execute(interaction) {
    const arg = interaction.options.getString('option')
    let setting = false;
    let msg = new MessageEmbed()
      .setColor('RED')
      .setDescription('Announcement updates have been disabled for this server')
    if (arg === 'true') {
      setting = true;
      msg = new MessageEmbed()
        .setColor('GREEN')
        .setDescription('Announcement updates have been enabled for this server')
    }
    await mongo().then(async (mongoose) => {
      try {
        await serverSettingsSchema.findOneAndUpdate({
          _id: interaction.guild.id
        },
          {
            _id: interaction.guild.id,
            enabled: setting
          },
          {
            upsert: true
          });
        await interaction.reply({ embeds: [msg], ephemeral: true })
      } catch (error) {
        console.error(`There was an error while updating a server setting! ${error}`)
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
      finally {
        mongoose.connection.close()
      }
    });
  }
}