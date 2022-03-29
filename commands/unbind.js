const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const mongo = require('../databases/mongo');
const serverSettingsSchema = require('../schemas/server-settings-schema');
const apiCategories = require('../data/api-categories.json');

module.exports = {
  permission: 'ADMINISTRATOR',
  serverOnly: true,
  data: new SlashCommandBuilder()
    .setName('unbind')
    .setDescription('Unbind current channel from specified announcement category')
    .addStringOption(option => {
      option.setName('category')
        .setDescription('Announcement category you want to unbind from this channel')
        .setRequired(true)
      apiCategories.map((cat) => {
        option.addChoice(cat.name, cat.value);
      })
      return option;
    }
    ),
  async execute(interaction) {
    const opt = interaction.options.getString('category');
    const categoryName = apiCategories.find(cat => cat.value === opt)['name'];
    let msg = new MessageEmbed()
    await mongo().then(async (mongoose) => {
      try {
        await serverSettingsSchema.findOneAndUpdate({
          _id: interaction.guild.id
        },
          {
            _id: interaction.guild.id,
            [opt]: 'none'
          },
          {
            upsert: true
          }
        );
        msg
          .setColor('GREEN')
          .setDescription(`Channel ${interaction.guild.channels.cache.get(interaction.channel.id).toString()} will no longer receive updates for the category \`${categoryName}\``);
      } catch (error) {
        console.log(`There was an error while updating a server setting! ${error}`)
        msg
          .setColor('RED')
          .setDescription('There was an error while trying to execute this command!')
      } finally {
        mongoose.connection.close();
        await interaction.reply({ embeds: [msg], ephemeral: true });
      }
    })
  }
}