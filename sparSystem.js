const {
    ActionRowBuilder,
    UserSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");


const sparRequests = new Map();
const activeSpars = new Map();
const sparCooldown = new Map();





async function startSpar(interaction) {


    const menu = new UserSelectMenuBuilder()

        .setCustomId("spar_select_player")

        .setPlaceholder("Search and select a spar opponent")

        .setMinValues(1)

        .setMaxValues(1);



    const row = new ActionRowBuilder()

        .addComponents(menu);




    await interaction.reply({

        content:
        "🥊 Select your spar opponent:",

        components:[row],

        ephemeral:true

    });


}








async function handleSparInteraction(interaction){





    // SELECT PLAYER

    if(

        interaction.isUserSelectMenu() &&

        interaction.customId === "spar_select_player"

    ){



        const opponent =
        interaction.users.first();





        if(opponent.id === interaction.user.id){


            return interaction.reply({

                content:
                "❌ You cannot spar yourself.",

                ephemeral:true

            });

        }





        sparRequests.set(interaction.user.id,{

            opponent: opponent.id,

            guild: interaction.guild.id

        });





        const modal = new ModalBuilder()

        .setCustomId("spar_details")

        .setTitle("Spar Details");






        const rounds = new TextInputBuilder()

        .setCustomId("rounds")

        .setLabel("Number of rounds")

        .setStyle(TextInputStyle.Short)

        .setPlaceholder("Example: 5")

        .setRequired(true);






        const server = new TextInputBuilder()

        .setCustomId("server")

        .setLabel("Private server link")

        .setStyle(TextInputStyle.Short)

        .setPlaceholder("Roblox private server link")

        .setRequired(true);






        const roblox = new TextInputBuilder()

        .setCustomId("roblox")

        .setLabel("Roblox Username (Optional)")

        .setStyle(TextInputStyle.Short)

        .setPlaceholder("Leave empty if none")

        .setRequired(false);






        modal.addComponents(

            new ActionRowBuilder()
            .addComponents(rounds),


            new ActionRowBuilder()
            .addComponents(server),


            new ActionRowBuilder()
            .addComponents(roblox)

        );




        return interaction.showModal(modal);


    }









    // MODAL SUBMIT


    if(

        interaction.isModalSubmit() &&

        interaction.customId === "spar_details"

    ){



        await interaction.deferReply({

            ephemeral:true

        });







        // COOLDOWN

        if(sparCooldown.has(interaction.user.id)){


            return interaction.editReply({

                content:
                "❌ Please wait before sending another spar request."

            });


        }




        sparCooldown.set(

            interaction.user.id,

            Date.now()

        );




        setTimeout(()=>{


            sparCooldown.delete(interaction.user.id);


        },60000);









        const data =
        sparRequests.get(interaction.user.id);





        if(!data){


            return interaction.editReply({

                content:
                "❌ Spar request expired."

            });


        }








        const rounds =
        interaction.fields.getTextInputValue("rounds");



        const server =
        interaction.fields.getTextInputValue("server");



        const roblox =
        interaction.fields.getTextInputValue("roblox");







        if(!server.includes("roblox.com")){


            return interaction.editReply({

                content:
                "❌ Please provide a valid Roblox private server link."

            });


        }








        const opponent =
        await interaction.client.users.fetch(data.opponent);






        const sparID =
        Date.now().toString();






        activeSpars.set(sparID,{

            player1: interaction.user.id,

            guild:data.guild,

            rounds,

            server,

            roblox

        });








        const embed = new EmbedBuilder()


        .setColor("#0099FF")


        .setTitle("🥊 URA SPAR REQUEST")


        .setDescription(

`
You received a spar request from **${interaction.user.username}**

Rounds:
**${rounds}**

Choose your decision.
`

        );









        const buttons = new ActionRowBuilder()


        .addComponents(


            new ButtonBuilder()

            .setCustomId(`accept_spar_${sparID}`)

            .setLabel("ACCEPT")

            .setStyle(ButtonStyle.Success),




            new ButtonBuilder()

            .setCustomId(`decline_spar_${sparID}`)

            .setLabel("DECLINE")

            .setStyle(ButtonStyle.Danger)


        );









        try{


            await opponent.send({


                // ONLY ONE PING

                content:`${opponent}`,

                embeds:[embed],

                components:[buttons]


            });





            sparRequests.delete(interaction.user.id);





            return interaction.editReply({

                content:
                "✅ Spar request sent!"

            });



        }catch(error){



            console.log(error);



            return interaction.editReply({

                content:
                "❌ Cannot DM this player."

            });



        }



    }



}






module.exports = {

    startSpar,

    handleSparInteraction,

    activeSpars

};