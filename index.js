require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

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

        const text = interaction.options.getString("message");

        await interaction.reply({
            content: "✅ Message sent!",
            ephemeral: true
        });

        await interaction.channel.send(text);
    }
});

client.login(process.env.TOKEN);