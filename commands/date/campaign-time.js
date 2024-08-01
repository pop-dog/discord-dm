const { SlashCommandBuilder } = require('discord.js');
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
      const reply = `It is ${currentDate.getTimeOfDayString()} on the ${currentDate.getOrdinalDayString()} of ${currentDate.getMonthString()}, ${currentDate.getFullYearString()}.` + "\n" + `*${currentDate.getDateDifferenceString(startDate)}*`;
      await interaction.reply(reply);
    } catch (error) {
      console.log(error);
      await interaction.reply(`An error occurred: ${error.message}`);
    }        
	},
};
