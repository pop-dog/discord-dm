import { SlashCommandBuilder } from '@discordjs/builders';
import { PartyFund } from '../../models/party-fund.model.js';
import { PFTransaction } from '../../models/pf-transaction.model.js';

export const BalanceCommand = {
	data: new SlashCommandBuilder()
		.setName('pf-balance')
		.setDescription('Calculate the current party fund balance.'),

	async execute(interaction) {

        try {
            const balance = await new PartyFund().getBalance();
            await interaction.reply(`The current party fund balance is ${balance} GP.`);
        } catch (error) {
            console.log(error);
            await interaction.reply(`An error occurred: ${error.message}`);
        }        
	},
};
