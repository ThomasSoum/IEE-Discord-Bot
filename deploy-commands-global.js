const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.CLIENT_TOKEN);

(async () => {
  try {
    console.log('[RELEASE] Started refreshing application (/) commands');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    console.log('[RELEASE] Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();