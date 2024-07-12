const { SlashCommandBuilder } = require('discord.js');
const { Client } = require("@notionhq/client")
const CONFIG = require('../../config.json');
const notion = new Client({ auth: CONFIG.notion.secretKey });


module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-db')
		.setDescription('Create a notion database.')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The name of the database.')
				.setRequired(true)),
	async execute(interaction) {
		const name = interaction.options.getString('name', true);
        const pageId = CONFIG.notion.pageId;

		if (!name) {
			return interaction.reply(`You must specify a name!`);
		}

        try {
            const newDb = await notion.databases.create({
              parent: {
                type: "page_id",
                page_id: pageId,
              },
              title: [
                {
                  type: "text",
                  text: {
                    content: name,
                  },
                },
              ],
              properties: {
                Name: {
                  title: {},
                },
              },
            })
            await interaction.reply(`Created new database with id ${newDb.id}!`);
          } catch (error) {
            console.log(error);
            await interaction.reply(`An error occurred: ${error.message}`);
          }

        
	},
};
