require("dotenv").config();

const http = require("http");

http.createServer((req, res) => {
    res.write("URA Bot is alive!");
    res.end();
}).listen(process.env.PORT || 3000);


const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});


client.once("clientReady", () => {
    console.log(`Logged in as ${client.user.tag}`);
});


client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    try {

        if (interaction.commandName === "ping") {
            await interaction.reply("Pong 🏓");
        }


        if (interaction.commandName === "say") {

            const ownerId = "1455426573741330495";

            if (interaction.user.id !== ownerId) {
                return interaction.reply({
                    content: "❌ You cannot use this command.",
                    ephemeral: true
                });
            }

            const message = interaction.options.getString("message");

            await interaction.reply({
                content: "✅ Sent!",
                ephemeral: true
            });

            await interaction.channel.send(message);
        }

    } catch (error) {
        console.error(error);
    }
});


client.login(process.env.TOKEN);