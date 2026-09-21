module.exports = {

    data: {
        name: "say",
        description: "Make the bot say something"
    },


    async execute(interaction) {


        const OWNER_ID = "1455426573741330495";


        if (interaction.user.id !== OWNER_ID) {

            return interaction.reply({

                content:
                "❌ You don't have permission to use this command.",

                ephemeral:true

            });

        }



        const message =
        interaction.options.getString("message");



        await interaction.reply({

            content:"✅ Sent",

            ephemeral:true

        });



        await interaction.channel.send(message);


    }


};