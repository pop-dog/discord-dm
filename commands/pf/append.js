import { SlashCommandBuilder } from '@discordjs/builders';
import { PartyFund } from '../../models/party-fund.model.js';
import { PFTransaction } from '../../models/pf-transaction.model.js';

export const AppendCommand = {
	data: new SlashCommandBuilder()
		.setName('pf-append')
		.setDescription('Append a transaction to the party fund ledger.')
        .addNumberOption(option =>
            option.setName('amount')
                .setDescription('The amount of the transaction.')
                .setRequired(true))
        .addStringOption(option =>
			option.setName('note')
				.setDescription('A note for the transaction.')),

	async execute(interaction) {
        const amount = interaction.options.getNumber('amount', true);
        const note = interaction.options.getString('note', false);
        const created_by_discord_user = interaction.user.username;

        try {
            
            const party_fund = new PartyFund();
            const transaction = new PFTransaction({
                amount,
                note,
                created_by_discord_user
            });

            const result = await party_fund.append(transaction);

            await interaction.reply(result.print());
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
