import { SlashCommandBuilder } from '@discordjs/builders';
import { PartyFund } from '../../models/party-fund.model.js';
import { PFTransaction } from '../../models/pf-transaction.model.js';

export const LedgerCommand = {
	data: new SlashCommandBuilder()
		.setName('pf-ledger')
		.setDescription('Show transactions in the party fund ledger.')
        .addStringOption(option =>
            option.setName('from')
                .setDescription('Show transactions from a specific date.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('to')
                .setDescription('Show transactions up to a specific date.')
                .setRequired(false)),

	async execute(interaction) {
        const from = interaction.options.getString('from', false);
        const to = interaction.options.getString('to', false);

        const from_date = from ? new Date(from) : null;
        const to_date = to ? new Date(to) : null;

        try {
            const transactions = await new PartyFund().readLedger({ from: from_date, to: to_date });

            let response = '```md\n';
            let currentDate = null;
            for (const transaction of transactions) {
                if (!currentDate || currentDate.toLocaleDateString() !== transaction.created_at.toLocaleDateString()) {
                    currentDate = transaction.created_at;
                    response += '# ' + currentDate.toLocaleDateString() + '\n';
                }
                const amount_string = (transaction.amount > 0 ? `+ ${transaction.amount}` : `- ${Math.abs(transaction.amount)}`) + ' GP';
                response += amount_string;
                if (transaction.note) {
                    response += ` (${transaction.note})`;
                }
                response += '\n';
            }
            // Calculate total balance
            const balance = transactions.reduce((acc, transaction) => {
                return acc + transaction.amount;
            }, 0);
            response += '\n';
            response += `Total balance over period: ${balance} GP\n`;
            response += '```';

            await interaction.reply(response);
        } catch (error) {
            console.log(error);
            await interaction.reply(`An error occurred: ${error.message}`);
        }        
	},
};
