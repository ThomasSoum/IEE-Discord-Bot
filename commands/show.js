const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const mongo = require('../databases/mongo');
const serverSettingsSchema = require('../schemas/server-settings-schema');
const apiCategories = require('../data/api-categories.json');

function generateEmbeds(nOfPages, interaction, serverSettings) {
  let apiCategoriesInChunks = [];
  let embeds = []
  let i = 0;
  let length = apiCategories.length;
  let size;
  while (i < length) {
    size = Math.ceil((length - i) / nOfPages--);
    apiCategoriesInChunks.push(apiCategories.slice(i, i += size));
  }
  for (let i = 0; i < apiCategoriesInChunks.length; i++) {
    embeds.push(
      new MessageEmbed()
        .setTitle(`${interaction.guild.name} announcements settings`)
        .setDescription(`Showing page ${i + 1} of ${apiCategoriesInChunks.length}`)
        .setThumbnail(interaction.guild.iconURL())
        .setColor('GREEN')
        .addFields(apiCategoriesInChunks[i].map((category) => {
          return {
            name: category.name,
            value: serverSettings[category.value] === 'none' ? 'This category is not bound to any channel yet' : interaction.guild.channels.cache.get(serverSettings[category.value]).toString()
          };
        })
        )
    )
  }
  return embeds;
}

module.exports = {
  permission: 'ADMINISTRATOR',
  serverOnly: true,
  data: new SlashCommandBuilder()
    .setName('show')
    .setDescription('Show which channel is bound to each category'),

  async execute(interaction) {
    let embeds = []
    const pages = {}

    await mongo().then(async (mongoose) => {
      try {
        serverSettings = await serverSettingsSchema.findOne({ _id: interaction.guild.id }).exec()

        embeds = generateEmbeds(4, interaction, serverSettings);

        const components = (state, id) => [
          new MessageActionRow().addComponents(
            [
              new MessageButton()
                .setStyle('SECONDARY')
                .setLabel('Back')
                .setEmoji('⬅️')
                .setCustomId('back')
                .setDisabled(state || pages[id] === 0),

              new MessageButton()
                .setStyle('SECONDARY')
                .setLabel('Forward')
                .setEmoji('➡️')
                .setCustomId('forward')
                .setDisabled(state || pages[id] === embeds.length - 1)
            ]
          )
        ];

        const id = interaction.member.id
        pages[id] = pages[id] || 0

        const embed = embeds[pages[id]]

        interaction.reply({
          ephemeral: true,
          embeds: [embed],
          components: components(false, id),
        });

        const filter = (interaction) => interaction.user.id === interaction.member.id;
        let collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 })

        collector.on('collect', (btnInt) => {
          if (!btnInt) {
            return
          }

          btnInt.deferUpdate()

          if (btnInt.customId !== 'back' && btnInt.customId !== 'forward') {
            return
          }

          if (btnInt.customId === 'back' && pages[id] > 0) {
            --pages[id]
          }

          if (btnInt.customId === 'forward' && pages[id] < embeds.length - 1) {
            ++pages[id]
          }

          interaction.editReply({
            embeds: [embeds[pages[id]]],
            components: components(false, id),
          })

        });

        collector.on('end', () => {
          interaction.editReply({ components: components(true) })
        })
      } catch (error) {
        console.log(`There was an error while updating a server setting! ${error}`)
        let errorMsg = new MessageEmbed()
          .setColor('RED')
          .setDescription('There was an error while trying to execute this command!')
        await interaction.reply({ embeds: [errorMsg], ephemeral: true });
      } finally {
        mongoose.connection.close();
      }
    })
  }
}