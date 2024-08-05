# Popdog's Discord DM

Some tools to help me while running a D&D campaign for friends.

## Description

I have various tools that I utilize when running my online D&D (and other tabletop) games -- some I use consistently,
other I try for a while and bounce off of. Discord is a constant. So, it seemed a good idea to write up some useful
functions and access them via a Discord bot. They are quick and easy to invoke, I already have Discord open while I
am running, and I have a convenient log of everything in my Discord server.

## Getting Started

### Dependencies

* [Discord.js](https://discord.js.org/)
* Docker
* Heroku account (optional. This is what I am using for hosting)
* Notion account (optiona. This is what I am using for persisting the *campaign info*. See below)

You will see that the **campaign-info** module utilizes Notion as its database. You could swap this out to whatever you like.
I chose Notion because it's *free* and I am already using it for my campaign notes.

### Installing

1. You will need a **Discord** bot. See the [Discord.js user guide](https://discordjs.guide) for more info. In particular, [Setting up a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html) and [Adding your bot to servers](https://discordjs.guide/preparations/adding-your-bot-to-servers.html).
2. Clone this project and install the dependencies.
```
npm install
```
3. I am using Github actions for CI/CD. You will need to configure the following secrets:

- CONFIG_JSON: This is a copy of the local config.json file. **Include this in your .gitignore**
```
{
    "discord": {
        "token": "",
        "clientId": "",
        "guildId": ""
    },
    "notion": {
        "secretKey": "",
        "pageId": "",
        "campaignInfoId": ""
    }
}
```
- HEROKU_API_KEY
- HEROKU_APP_NAME
- HEROKU_EMAIL

### Executing program

1. **Register** commands to discord
```
node .\deploy-commands.js
```
2. Run the bot!
```
node .
```