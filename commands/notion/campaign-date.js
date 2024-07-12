const { SlashCommandBuilder } = require('discord.js');
const { Client } = require("@notionhq/client")
const CONFIG = require('../../config.json');
const { getFriendlyCampaignDate, getFriendlyDateDifference } = require('../../helpers/date-helper');
const notion = new Client({ auth: CONFIG.notion.secretKey });


module.exports = {
	data: new SlashCommandBuilder()
		.setName('campaign-date')
		.setDescription('Gets the current in-game date.'),
	async execute(interaction) {
    const campaignInfoId = CONFIG.notion.campaignInfoId;

    try {
        const campaignInfoDB = await notion.databases.query({
            database_id: campaignInfoId,
        });

        if (!campaignInfoDB || campaignInfoDB.results.length === 0) throw new Error('No campaign info found.');

        const campaignProps = campaignInfoDB.results[0].properties;
        const currentDate = new Date(campaignProps['Current Date'].date.start);
        const startDate = Date.parse(campaignProps['Start Date'].date.start);

        const friendlyCampaignDate = getFriendlyCampaignDate(currentDate);
        const friendlyDateDifference = getFriendlyDateDifference(startDate, currentDate);

        await interaction.reply(`${friendlyCampaignDate} 
*${friendlyDateDifference}*`);
    } catch (error) {
      console.log(error);
      await interaction.reply(`An error occurred: ${error.message}`);
    }        
	},
};
