const { MessageEmbed } = require('discord.js');
const mongo = require('./databases/mongo');
const serverSettingsSchema = require('./schemas/server-settings-schema');
const apiCategories = require('./data/api-categories.json');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { Level } = require('level');
const util = require('util');
const db = new Level('./databases/announcements-db', { valueEncoding: 'json' });
util.promisify(Level);
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function getAuthToken() {
  const params = new URLSearchParams({
    client_id: process.env.API_CLIENT_ID,
    client_secret: process.env.API_CLIENT_SECRET,
    grant_type: 'client_credentials',
    scope: 'announcements'
  });
  try {
    const auth_Req = await fetch('https://login.iee.ihu.gr/token', {
      method: 'POST',
      body: params,
    });
    const auth_Token = await auth_Req.json();
    if (auth_Token.error) {
      throw auth_Token.error.message;
    }
    return auth_Token.access_token;
  } catch (error) {
    console.error(`❌ An error occurred while trying to acquire Auth Token. ${error}`)
    throw `Unexpected error occurred while getting auth token. ${error}`;
  }
}

async function getLastTenAnnouncements(authToken) {
  if (!authToken) throw 'authToken is a required field for function getLastTenAnnouncements';
  let announcements = [];
  try {
    const announcementsRequest = await fetch('https://api.iee.ihu.gr/announcements?pageSize=10&fields=_id,_about', {
      method: 'GET',
      headers: { 'x-access-token': authToken }
    });

    const announcementsResults = await announcementsRequest.json();

    announcementsResults.forEach((announcement) => {
      if (!apiCategories.find(category => category._id === announcement._about)) return;
      announcements.push(announcement);
    });

    return announcements;
  } catch (error) {
    throw `Unexpected error occurred while getting last 10 announcements. ${error}`
  }
}

async function getAnnouncementDetails(authToken, announcements) {
  if (!authToken) throw 'authToken is a required field for function getAnnouncementDetails';
  if (!announcements) throw 'announcements is a required field for function getAnnouncementDetails';
  let array = [];
  try {
    for (const announcement of announcements) {
      const announcementRequest = await fetch(
        `https://api.iee.ihu.gr/announcements?q={\"_id\":\"${announcement}\"}&fields=_id,_about,text,title,publisher,attachments`,
        {
          method: "GET",
          headers: { "x-access-token": authToken },
        }
      );

      const announcementResults = await announcementRequest.json();
      array.push(announcementResults);
    }
  } catch (error) {
    throw error;
  }
  return array;
}

async function compareWithDB(announcements) {
  if (!announcements) throw 'announcements is a required field for function compareWithDB';
  const array = await db.get('announcements')
    .then(data => {
      let newAnnouncements = [];
      if (data.announcementsArray.length === 0) {
        throw 'Announcement array is empty';
      }
      for (let i = data.announcementsArray.length - 1; i >= 0; i--) {
        if (!data.announcementsArray.find((ann) => ann._id === announcements[i]._id)) {
          newAnnouncements.push(announcements[i]._id);
        }
      }
      return newAnnouncements;
    })
    .catch(error => {
      if (error.code === 'LEVEL_NOT_FOUND') {
        db.put('announcements', { announcementsArray: announcements })
          .catch(error => {
            throw error;
          })
      }
      throw error;
    })
  return array;
}

async function getServers(bot) {
  if (!bot) throw 'bot is a required field for function getServers';
  let servers = []
  for (const guild of bot.guilds.cache) {
    await mongo().then(async (mongoose) => {
      try {
        const server = await serverSettingsSchema.findOne({
          _id: guild[1].id,
          enabled: true,
        });
        if (!server) {
          return;
        }
        servers.push(server);
      } catch (error) {
        throw error;
      }
    })
  }
  return servers;
}

async function downloadFiles(authToken, files, announcementID) {
  if (!fs.existsSync(`./downloads/${announcementID}`)) {
    fs.mkdirSync(`./downloads/${announcementID}`);
  }

  let filesArray = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const fileRequest = await fetch(`https://api.iee.ihu.gr/files/${files[i]}`, {
        method: 'GET',
        headers: { 'x-access-token': authToken }
      });

      const fileResults = await fileRequest.json();

      const data = new Uint8Array(Buffer.from(fileResults.data.data));
      try {
        fs.writeFileSync(`./downloads/${announcementID}/${fileResults.name}`, data, 'binary')
        filesArray.push(fileResults.name);
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
    return filesArray;
  }
}

async function generateEmbed(announcement) {
  const msg = new MessageEmbed()
    .setColor('GREEN')
    .setTitle(announcement.title)
    .setURL(`https://apps.iee.ihu.gr/announcements/announcement/${announcement._id}`)
    .setDescription(announcement.text)
    .setAuthor({ name: `${apiCategories.find(cat => cat._id === announcement._about).name} - ${announcement.publisher.name}` })
    .setTimestamp()

  return msg;
}

async function updateDatabase(announcements) {
  if (!announcements) throw 'announcements is a required field for function updateDatabase';
  await db.put('announcements', { announcementsArray: announcements })
    .catch(error => {
      throw error;
    })
  return;
}


module.exports = async function main(bot) {
  let retries = 3;

  while (retries) {
    try {
      const authToken = await getAuthToken();
      const announcementToCheck = await getLastTenAnnouncements(authToken);
      const newAnnouncements = await compareWithDB(announcementToCheck);
      if (newAnnouncements.length === 0) {
        return;
      }
      const servers = await getServers(bot);
      const announcements = await getAnnouncementDetails(authToken, newAnnouncements);
      for (announcement of announcements) {
        let hasAttachment = false;
        const embed = await generateEmbed(announcement[0]);
        if (!(announcement[0].attachments.length === 0)) {
          hasAttachment = true;
          let attachments = [];
          const files = await downloadFiles(authToken, announcement[0].attachments, announcement[0]._id);
          for (i = 0; i < files.length; i++) {
            attachments.push({ attachment: path.join(__dirname, `./downloads/${announcement[0]._id}/${files[i]}`), name: files[i] });
          }
          embed.addField(`Announcement contains ${announcement[0].attachments.length} file/s. Located at the top of the message.`, files.toString());
        }
        for (let i = 0; i < servers.length; i++) {
          const announcementCategory = apiCategories.find(category => category._id === announcement[0]._about).value;
          if (servers[i][announcementCategory] === 'none') continue;
          let sendMsgRetries = 5;
          while (sendMsgRetries) {
            try {
              const guild = bot.guilds.cache.get(servers[i]._id);
              if (!guild) throw 'Failed to get guild.'
              if (hasAttachment) {
                guild.channels.cache.get(servers[i][announcementCategory]).send({ content: '@here', embeds: [embed], files: Array.from(attachments.values()) });
              } else {
                guild.channels.cache.get(servers[i][announcementCategory]).send({ content: '@here', embeds: [embed] });
              }
              break;
            } catch (error) {
              sendMsgRetries -= 1;
              console.log(`Send message retries left: ${sendMsgRetries}`);
              console.log(error);
              await new Promise(res => setTimeout(res, 3000));
            }
          }
          await new Promise(res => setTimeout(res, 500));
        }
        await new Promise(res => setTimeout(res, 500));
      }
      let updateDBretries = 5;
      while (updateDBretries) {
        try {
          await updateDatabase(announcementToCheck);
        } catch (error) {
          updateDBretries -= 1;
          console.log(`Update database retries left: ${updateDBretries}`);
          console.log(error);
          await new Promise(res => setTimeout(res, 2000));
        }
      }
      break;
    } catch (error) {
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      console.log(error);
      await new Promise(res => setTimeout(res, 10000));
    }
  }
}