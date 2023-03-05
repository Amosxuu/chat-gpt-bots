import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { commands } from './config';

export const discordService = () => {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
        console.log(interaction)
        if (interaction.commandName === 'ping') {
            await interaction.reply('Pong!');
        }
    });

    client.login(process.env.DISCORD_TOKEN);
    

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
}
