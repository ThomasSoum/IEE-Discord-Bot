const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const fs = require('node:fs');
require('dotenv').config();
const cron = require('node-cron');
const checkForNewAnnouncements = require('./monitor');

const bot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
});

bot.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.data.name, command);
}


bot.once('ready', async () => {
  console.log('Ready!')
  cron.schedule("*/6 * * * *", () => {
    checkForNewAnnouncements(bot);
  });
})


bot.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = bot.commands.get(interaction.commandName);

  if (!command) return;

  try {
    if (command.serverOnly === true && interaction.guild === null) {
      const dmError = new MessageEmbed()
        .setColor('RED')
        .setDescription('This command can only be used from a server.')
      return await interaction.reply({ embeds: [dmError], ephemeral: true });
    } else if (command.permission) {
      const authorPermission = interaction.channel.permissionsFor(interaction.member);
      if (!authorPermission || !authorPermission.has(command.permission)) {
        const permissionError = new MessageEmbed()
          .setColor('RED')
          .setDescription('You do not have the required permissions to run this command.')
        return await interaction.reply({ embeds: [permissionError], ephemeral: true });
      }
    }
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});


bot.login(process.env.CLIENT_TOKEN);