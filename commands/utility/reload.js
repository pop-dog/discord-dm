const { SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command.')
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true)),
	async execute(interaction) {
		const commandName = interaction.options.getString('command', true).toLowerCase();
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			return interaction.reply(`There is no command with name \`${commandName}\`!`);
		}

		// Get the path of the command file
		const commandPath = findCommand(command.data.name);

		if (!commandPath) {
			return interaction.reply(`Could not find command \`${commandName}\`!`);
		}

        delete require.cache[require.resolve(commandPath)];

        try {
            const newCommand = require(commandPath);
            interaction.client.commands.set(newCommand.data.name, newCommand);
            await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
        } catch (error) {
            console.error(error);
            await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
        }
	},
};

function findCommand(name) {
	// First, check commands folder
	const basePath = path.join(__dirname, '..');
	const commandSubfolders = fs.readdirSync(basePath);

	// Check subfolders
	for (const folder of commandSubfolders) {
		const folderPath = path.join(basePath, folder);
		if (fs.existsSync(path.join(folderPath, `${name}.js`))) return path.join(folderPath, `${name}.js`);
	}
}