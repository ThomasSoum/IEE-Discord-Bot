const { Client, Intents } = require('discord.js');
require('dotenv').config();

const bot = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

bot.once('ready', async () => {
  console.log('Ready!')
})

bot.login(process.env.CLIENT_TOKEN);