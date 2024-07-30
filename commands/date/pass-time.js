const { SlashCommandBuilder } = require('discord.js');
const { getFriendlyCampaignDateWithHour } = require('../../helpers/date-helper');
const CampaignInfo = require('../../models/campaign-info.model');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('pass-time')
		.setDescription('Gets the current in-game date.')
        .addStringOption(option =>
			option.setName('interval')
				.setDescription('A time interval. e.g., 1d 3h or 3w. Valid units are h, d, w, m, y.')
				.setRequired(true)),
	async execute(interaction) {
        const interval = interaction.options.getString('interval', true);

        try {
            if (!interval) {
                await interaction.reply(`Invalid options for /pass-time command.`);
                return;
            }
            let sanitizedInterval = interval.replace(/\s/g, '');

            const campaignInfo = new CampaignInfo();
            const currentDate = await campaignInfo.get('Current Date');

            // Check if the interval starts with a '-' sign
            // If so, subtract time instead of adding it
            const isSubtracting = sanitizedInterval.startsWith('-');
            if (isSubtracting) {
                sanitizedInterval = sanitizedInterval.substring(1);
            }

            // Parse the interval
            const parts = sanitizedInterval.split(/(\d+)/).filter(Boolean);
            if (parts.length % 2 !== 0) throw new Error('Invalid interval format.');
            const intervals = [];
            for (let i = 0; i < parts.length; i += 2) {
                intervals.push({ amount: parseInt(parts[i]), unit: parts[i + 1] });
            }

            // Add the intervals to the current date
            let largestInterval;
            intervals.forEach(i => {
                const adjustment = isSubtracting ? -i.amount : i.amount;
                switch (i.unit) {
                    case 'h':
                        if (!largestInterval || i.amount > largestInterval.amount) largestInterval = i;
                        currentDate.setHours(currentDate.getHours() + adjustment);
                        break;
                    case 'd':
                        if (!largestInterval || isUnitLarger('d', largestInterval.unit) || (largestInterval.unit == 'd' && i.amount > largestInterval.amount)) largestInterval = i;
                        currentDate.setDate(currentDate.getDate() + adjustment);
                        break;
                    case 'w':
                        if (!largestInterval || isUnitLarger('w', largestInterval.unit) || (largestInterval.unit == 'w' && i.amount > largestInterval.amount)) largestInterval = i;
                        currentDate.setDate(currentDate.getDate() + (7 * adjustment));
                        break;
                    case 'm':
                        if (!largestInterval || isUnitLarger('m', largestInterval.unit) || (largestInterval.unit == 'm' && i.amount > largestInterval.amount)) largestInterval = i;
                        currentDate.setMonth(currentDate.getMonth() + adjustment);
                        break;
                    case 'y':
                        if (!largestInterval || isUnitLarger('y', largestInterval.unit) || (largestInterval.unit == 'y' && i.amount > largestInterval.amount)) largestInterval = i;
                        currentDate.setFullYear(currentDate.getFullYear() + adjustment);
                        break;
                }
            });

            // Update the date in Notion
            await campaignInfo.set('Current Date', currentDate);

            // Based on the largest interval, create a friendly message indicating how much time has passed
            if (largestInterval) {
                const friendlyInterval = `${largestInterval.amount} ${largestInterval.amount > 1 ? getFriendlyUnitName(largestInterval.unit) + 's have' : getFriendlyUnitName(largestInterval.unit) + ' has'} passed.`;
                await interaction.reply(`${friendlyInterval}
${getFriendlyCampaignDateWithHour(currentDate)}`);
            } else {
                await interaction.reply(`${getFriendlyCampaignDateWithHour(currentDate)}`);
            }
        } catch (error) {
        console.log(error);
        await interaction.reply(`An error occurred: ${error.message}`);
        }        
	},
};

function getFriendlyUnitName(unit) {
    switch (unit) {
        case 'h':
            return 'hour';
        case 'd':
            return 'day';
        case 'w':
            return 'week';
        case 'm':
            return 'month';
        case 'y':
            return 'year';
    }
}

function isUnitLarger(u1, u2) {
    const units = ['h', 'd', 'w', 'm', 'y'];
    return units.indexOf(u1) > units.indexOf(u2);
}
