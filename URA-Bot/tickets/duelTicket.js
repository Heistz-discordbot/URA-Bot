const {

    ChannelType,

    PermissionFlagsBits,

    EmbedBuilder,

    ActionRowBuilder,

    ButtonBuilder,

    ButtonStyle

} = require("discord.js");





const DUEL_CATEGORY_ID = "1533857392511680562";







async function createDuelTicket(

    client,

    guild,

    player1,

    player2,

    rounds,

    serverLink,

    roblox

) {



    const channel = await guild.channels.create({


        name: `duel-${player1.username}-${player2.username}`,


        type: ChannelType.GuildText,


        parent: DUEL_CATEGORY_ID,



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


    .setColor("#FF0000")


    .setTitle("⚔️ URA DUEL")


    .addFields(



        {

            name: "👥 Participants",

            value:

            `${player1}\n${player2}`,

            inline:true

        },



        {

            name: "⚔️ Rounds",

            value:

            `${rounds}`,

            inline:true

        },



        {

            name: "🌐 Private Server",

            value:

            `${serverLink}`,

            inline:true

        }



    )


    .addFields({


        name:"Status",

        value:"🟢 Active",

        inline:false


    });









    const buttons = new ActionRowBuilder()


    .addComponents(



        new ButtonBuilder()

        .setCustomId("update_duel_score")

        .setLabel("UPDATE SCORE")

        .setStyle(ButtonStyle.Primary),





        new ButtonBuilder()

        .setCustomId("end_duel")

        .setLabel("END")

        .setStyle(ButtonStyle.Success),





        new ButtonBuilder()

        .setCustomId("delete_duel_ticket")

        .setLabel("DELETE TICKET")

        .setStyle(ButtonStyle.Danger)



    );







    if(roblox){


        buttons.addComponents(


            new ButtonBuilder()

            .setLabel("OPEN PROFILE")

            .setStyle(ButtonStyle.Link)

            .setURL(
                `https://www.roblox.com/users/${roblox}/profile`
            )


        );


    }









    await channel.send({


        content:

        `${player1} ${player2}`,



        embeds:[embed],



        components:[buttons]


    });






    return channel;


}







module.exports = {


    createDuelTicket


};
