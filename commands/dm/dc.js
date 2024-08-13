import { SlashCommandBuilder } from '@discordjs/builders';

const BASE_DC = {
    'Very easy': 5,
    'Easy': 10,
    'Medium': 15,
    'Hard': 20,
    'Very hard': 25,
    'Nearly impossible': 30
};

export const DCCommand = {
	data: new SlashCommandBuilder()
		.setName('dc')
		.setDescription('Generates a difficulty class of the specified difficulty.')
		.addStringOption(option =>
			option.setName('difficulty')
                .addChoices(Object.entries(BASE_DC).map(x => {
                    return {name: x[0], value: x[0]}
                }))
				.setDescription('The relative difficulty of the task.')
				.setRequired(true)),
	async execute(interaction) {
		const difficulty = interaction.options.getString('difficulty', true);

		if (!difficulty) {
			return interaction.reply(`You must specify a difficulty!`);
		}

        if (!BASE_DC[difficulty]) {
            return interaction.reply(`There is no difficulty class with name \`${difficulty}\`!`);
        }

        // Get the base DC
        const dc = BASE_DC[difficulty];
        // Add a random modifier between -3 and 3
        const modifier = Math.floor(Math.random() * 7) - 3;
        const total = dc + modifier;

        await interaction.reply(`The DC of this ${difficulty} task is: **${total}**.`);
	},
};