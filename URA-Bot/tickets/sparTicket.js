const {

    ChannelType,

    PermissionFlagsBits,

    EmbedBuilder,

    ActionRowBuilder,

    ButtonBuilder,

    ButtonStyle

} = require("discord.js");





const SPAR_CATEGORY_ID = "1533857392511680562";







async function createSparTicket(

    client,

    guild,

    player1,

    player2,

    rounds,

    serverLink,

    roblox

) {



    const channel = await guild.channels.create({


        name: `spar-${player1.username}-${player2.username}`,


        type: ChannelType.GuildText,


        parent: SPAR_CATEGORY_ID,



        permissionOverwrites: [



            {

                id: guild.id,

                deny: [

                    PermissionFlagsBits.ViewChannel

                ]

            },



            {

                id: player1.id,

                allow: [

                    PermissionFlagsBits.ViewChannel,

                    PermissionFlagsBits.SendMessages

                ]

            },



            {

                id: player2.id,

                allow: [

                    PermissionFlagsBits.ViewChannel,

                    PermissionFlagsBits.SendMessages

                ]

            }



        ]

    });









    const embed = new EmbedBuilder()


        .setColor("#0099FF")


        .setTitle("🥊 URA SPAR")


        .addFields(



            {

                name: "👥 Participants",

                value:

                `${player1}\n${player2}`,

                inline: true

            },



            {

                name: "⚔️ Rounds",

                value:

                `${rounds}`,

                inline: true

            },



            {

                name: "🌐 Private Server",

                value:

                `${serverLink}`,

                inline: true

            }



        )


        .addFields({


            name: "Status",

            value:

            "🟢 Active",

            inline:false


        });









    const buttons = new ActionRowBuilder()


        .addComponents(



            new ButtonBuilder()

            .setCustomId("update_score")

            .setLabel("UPDATE SCORE")

            .setStyle(ButtonStyle.Primary),





            new ButtonBuilder()

            .setCustomId("end_spar")

            .setLabel("END")

            .setStyle(ButtonStyle.Success),





            new ButtonBuilder()

            .setCustomId("delete_ticket")

            .setLabel("DELETE TICKET")

            .setStyle(ButtonStyle.Danger)



        );









    await channel.send({


        embeds:[embed],


        components:[buttons]


    });






    return channel;


}







module.exports = {


    createSparTicket


};