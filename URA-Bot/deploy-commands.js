const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();


const commands = [

    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check bot latency"),


    new SlashCommandBuilder()
        .setName("say")
        .setDescription("Send a message as the bot")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("Message to send")
                .setRequired(true)
        ),


    new SlashCommandBuilder()
        .setName("battle")
        .setDescription("Open the URA Battle System")

].map(command => command.toJSON());



const rest = new REST({
    version: "10"
}).setToken(process.env.TOKEN);



async function deployCommands() {

    try {

        console.log("🔄 Registering URA commands...");


        if(!process.env.CLIENT_ID){

            throw new Error(
                "Missing CLIENT_ID in .env"
            );

        }


        if(!process.env.GUILD_ID){

            throw new Error(
                "Missing GUILD_ID in .env"
            );

        }


        await rest.put(

            Routes.applicationGuildCommands(

                process.env.CLIENT_ID,

                process.env.GUILD_ID

            ),

            {
                body: commands
            }

        );


        console.log(
            "✅ URA commands registered successfully!"
        );


    } catch(error) {

        console.error(
            "❌ Command deployment failed:"
        );

        console.error(error);

    }

}



deployCommands();