const { REST, Routes } = require("discord.js");
require("dotenv").config();

const rest = new REST({
    version: "10"
}).setToken(process.env.TOKEN);


async function clearCommands() {

    try {

        console.log("Deleting global commands...");

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            {
                body: []
            }
        );

        console.log("Global commands deleted!");

    } catch (error) {

        console.error(error);

    }

}


clearCommands();