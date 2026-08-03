require("dotenv").config();

const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Checks if the bot is online"),

    new SlashCommandBuilder()
        .setName("say")
        .setDescription("Make the bot say something")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("The message you want the bot to send")
                .setRequired(true)
        )
].map(command => command.toJSON());


const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

const CLIENT_ID = "1533515596283642147";


async function main() {
    try {
        console.log("Registering commands...");

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        console.log("Successfully registered commands!");
    } catch (error) {
        console.error(error);
    }
}

main();