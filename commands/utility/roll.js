const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll some dice!')
		.addStringOption(option =>
			option.setName('expression')
				.setDescription('The dice to roll. (e.g. 2d6 or 1d20+5)')
				.setRequired(true)),
	async execute(interaction) {
		const expression = interaction.options.getString('expression', true);

		if (!expression) {
			return interaction.reply(`Invalid options for /roll command.`);
		}

        await interaction.reply(roll(expression));
	},
};

function roll(diceExpression) {
    if (!diceExpression) {
        return 'No dice expression provided.'
    }
    const santizedDiceExpression = diceExpression.replace(/\s/g, '');

    // Initialize variables
    let start = 0;
    let currentSign = '';
    // Holds the total of all rolls
    let total = 0;
    // Holds the end modifier
    let mod = 0;
    // Holds the rolls
    let rolls = [];

    // Loop over each character in the expression
    for (let i = 0; i < santizedDiceExpression.length; i++) {
        const c = santizedDiceExpression[i];
        
        // Check if we reached a + or - sign or the end of the expression
        if (c == '+' || c == '-' || i == santizedDiceExpression.length - 1) {

            let end = i  + 1;
            if (c == '+' || c == '-') end = i; // Don't include the sign in the substring

            // Create a substring from the start of the expression to the current index
            let die = santizedDiceExpression.substring(start, end);

            // Validate the die string
            if (!die.match(/^[0-9]+[d]?[0-9]*$/)) return 'Invalid dice expression.';

            const parts = die.split('d');

            // Is a dice roll (e.g. 1d20)
            if (parts.length == 2) {
                const numRolls = parseInt(parts[0]);
                const numSides = parseInt(parts[1]);
                const roll = rollDie(numRolls, numSides);
                total = currentSign == '-' ? total - roll.total : total + roll.total;
                if (currentSign == '-') roll.rolls = roll.rolls.map(r => -r);
                rolls = rolls.concat(roll.rolls);
            }
            // Is a modifier (e.g. +5) 
            else if (parts.length == 1)
            {
                mod = currentSign == '-' ? mod - parseInt(parts[0]) : mod + parseInt(parts[0]);
                total = currentSign == '-' ? total - parseInt(parts[0]) : total + parseInt(parts[0]);
            }

            // Set the start of the next substring
            start = i+1;

            // Set the current sign
            currentSign = c;
        }
    }

    // Sort rolls in descending order
    rolls.sort((a, b) => b - a);

    // Format the response
    return formatResponse(diceExpression, total, rolls, mod);
}


function formatResponse(expression, total, rolls, mod) {
    let r = `\`\`\`\n> Rolling (${expression})...\n`;
    if (rolls.length == 1 && !mod) {
        r += `> [${rolls[0]}]\n\`\`\``;
    } else {
        r += '> ';
        for (let i = 0; i < rolls.length; i++) {
            if (i > 0) r += ' ';
            r += `[${rolls[i]}]`;
        }
        r += '\n';
        if (mod) {
            r += `> ${mod}\n`;
        }
        r += '--------\n';
        r += `> ${total}\n\`\`\``;
    }
    return r;
}

function rollDie(numRolls, numSides) {
    const rolls = [];
    let total = 0;
    for (let i = 0; i < numRolls; i++) {
        const roll = rollSingleDie(numSides);
        rolls.push(roll);
        total += roll;
    }
    return { rolls, total };
}

function rollSingleDie(numSides) {
    return Math.floor(Math.random() * numSides) + 1;
}