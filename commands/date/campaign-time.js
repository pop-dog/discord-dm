const { SlashCommandBuilder } = require('discord.js');
const { getFriendlyCampaignDateWithHour, getFriendlyDateDifference } = require('../../helpers/date-helper');
const CampaignInfo = require('../../models/campaign-info.model');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('campaign-time')
		.setDescription('Gets the current in-game date and time.'),
	async execute(interaction) {

    try {
      const campaignInfo = new CampaignInfo();
      const currentDate = await campaignInfo.get('Current Date');
      const startDate = await campaignInfo.get('Start Date');

      const friendlyCampaignDate = getFriendlyCampaignDateWithHour(currentDate);
      const friendlyDateDifference = getFriendlyDateDifference(startDate, currentDate);

      await interaction.reply(`${friendlyCampaignDate} 
*${friendlyDateDifference}*`);
    } catch (error) {
      console.log(error);
      await interaction.reply(`An error occurred: ${error.message}`);
    }        
	},
};
