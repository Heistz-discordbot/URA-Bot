const { EmbedBuilder } = require("discord.js");

module.exports = {

    data: {
        name: "ping",
        description: "Shows bot status"
    },


    async execute(interaction) {

        const client = interaction.client;


        const uptime = process.uptime();

        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);



        const memory = Math.round(
            process.memoryUsage().heapUsed / 1024 / 1024
        );


        const cpu = process.cpuUsage().user / 1000000;



        const embed = new EmbedBuilder()

            .setColor("#0099FF")

            .setTitle("🏓 URA Bot Status")

            .setDescription(
`
🟢 **Shard [0]**
📶 **Latency:** ${client.ws.ping}ms
⏱️ **Uptime:** ${days}d ${hours}h ${minutes}m
📊 **Resources:**
💾 **RAM:** ${memory} MB
⚙️ **CPU:** ${cpu.toFixed(2)}%
📈 **Size:**
🖥️ **Servers:** ${client.guilds.cache.size}
👥 **Users:** ${client.users.cache.size}
`
            )

            .setTimestamp();



        await interaction.reply({

            embeds: [embed]

        });

    }

};