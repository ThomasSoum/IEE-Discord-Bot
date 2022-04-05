<div id="top"></div>
<!-- Project LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ThomasSoum/IEE-Discord-Bot">
    <img src="./images/banner.png" alt="Logo">
  </a>

  <h3 align="center">IEE IHU Announcement Discord Bot</h3>

  <p align="center">
    The perfect discord bot for any server related to the Department of Information and Electronic Engineering of the International Hellenic University.
    <br />
    <a href="https://discord.com/api/oauth2/authorize?client_id=957568997853908993&permissions=139586890816&scope=applications.commands%20bot">Invite Bot</a>
    ·
    <a href="https://github.com/ThomasSoum/IEE-Discord-Bot/issues">Report Bug</a>
    ·
    <a href="https://github.com/ThomasSoum/IEE-Discord-Bot/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

## :ledger: Table of Contents

- [About](#question-about-the-project)
  - [Built With](#wrench-built-with)
- [Getting Started](#rocket-getting-started)
  - [Prerequisites](#memo-prerequisites)
  - [Installation](#installation)
  - [Usage](#zap-usage)
- [Commands](#clipboard-commands)
- [License](#lock-license)
- [Contact](#envelope-contact)

<!-- ABOUT THE PROJECT -->

## :question: About The Project

IEE Discord Bot is an open-source Discord bot created to provide a painless way for servers related to the [Department of Information and Electronic Engineering](https://www.iee.ihu.gr/en/) of the [International Hellenic University](https://www.ihu.gr/ucips/) to automatically receive announcements as they get published on the department's site. It also provides some general information commands that can be executed from a server channel or as a DM to the bot.
You can invite it to your Discord server using [this](invite-link-here) link!

<p align="right">(<a href="#top">back to top</a>)</p>

### :wrench: Built With

- [NodeJS](https://nodejs.org/en/)
- [DiscordJS](https://discord.js.org/#/)
- [IEE IHU API](https://github.com/apavlidi/IT_API/wiki/API-Documentation)
- [MongoDB](https://www.mongodb.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## :rocket: Getting Started

Want to host the bot yourself? If not, [invite it](https://discord.com/api/oauth2/authorize?client_id=957568997853908993&permissions=139586890816&scope=applications.commands%20bot)?

### :memo: Prerequisites

- [NodeJS](https://nodejs.org/en/) version 16 or newer
- Discord bot token and id. [Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
- IEE API credentials. [Guide](https://login.iee.ihu.gr/) (NOTE: You need to be a registered student at the university to access the page.)
- [MongoDB](https://www.mongodb.com/) database. You can set one up for free using [MongoDB Atlas](https://www.mongodb.com/docs/atlas/getting-started/) or host it yourself.

<p align="right">(<a href="#top">back to top</a>)</p>

<div id="installation"></div>

### :electric_plug: Installation

1. Clone the project
   ```bash
   git clone https://github.com/ThomasSoum/IEE-Discord-Bot.git
   ```
2. Go to the project directory
   ```bash
   cd IEE-Discord-Bot
   ```
3. Install dependencies
   ```bash
   npm install
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

### :zap: Usage

1. Rename or copy the .env.example to .env
2. In the .env file replace all the text between " " by your parameter values

   ```sh
   # Discord Bot Configs
   CLIENT_TOKEN="<YOUR_CLIENT_TOKEN>"
   CLIENT_ID="<YOUR_CLIENT_ID>"

   GUILD_ID="<YOUR_GUILD_ID>"

   # Mongo DB Configs
   MONGO_URI="<YOUR_MONGO_DB_URI>"

   # IEE API Configs
   API_CLIENT_ID="<YOUR_API_CLIENT_ID>"
   API_CLIENT_SECRET="<YOUR_API_CLIENT_SECRET>"
   ```

   More information about each environment variable can be found inside the .env.example file.

3. Run the node server
   ```bash
   node index.js
   ```
4. Deploy the commands to your bot
   ```bash
   node deploy-commands-global.js
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Commands -->

## :clipboard: Commands

### General commands:

- `/contact` - Responds with the contact information of the department.
- `/map` - Responds with an image of the map of the university.
- `/uptime` - Responds with the uptime of the bot.
- `/ping` - Responds with pong and some latency information, indicates if the bot is online.

### Server only commands:

- `/announcements <ON/OFF>` - Activate announcement updates for the server.
- `/bind <Category>` - Binds channel to the specified announcement category.
- `/unbind <Category>` - Unbinds channel from specified announcement category.
- `/show` - Shows a list of announcement categories and which channel is bound to each category.

<p align="right">(<a href="#top">back to top</a>)</p>

## :lock: License

MIT License

Copyright (c) 2022 Thomas Soumpasis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

<p align="right">(<a href="#top">back to top</a>)</p>

## :envelope: Contact

Thomas Soumpasis - thomasoumpasis@gmail.com

Project Link: [https://github.com/ThomasSoum/IEE-Discord-Bot](https://github.com/ThomasSoum/IEE-Discord-Bot)

<p align="right">(<a href="#top">back to top</a>)</p>
