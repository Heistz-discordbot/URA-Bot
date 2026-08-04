const {
    ActionRowBuilder,
    UserSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");


const activeDuels = new Map();
const duelRequests = new Map();
const duelCooldown = new Map();





async function startDuel(interaction) {


    const menu = new UserSelectMenuBuilder()

        .setCustomId("duel_select_player")

        .setPlaceholder("Search and select your opponent")

        .setMinValues(1)

        .setMaxValues(1);



    const row = new ActionRowBuilder()

        .addComponents(menu);





    await interaction.reply({

        content:
        "⚔️ Select your duel opponent:",

        components:[row],

        ephemeral:true

    });


}









async function handleDuelInteraction(interaction){





    // SELECT PLAYER

    if(

        interaction.isUserSelectMenu() &&

        interaction.customId === "duel_select_player"

    ){



        const opponent =
        interaction.users.first();





        if(opponent.id === interaction.user.id){


            return interaction.reply({

                content:
                "❌ You cannot duel yourself.",

                ephemeral:true

            });


        }







        duelRequests.set(interaction.user.id,{

            opponent: opponent.id,

            guild: interaction.guild.id

        });







        const modal = new ModalBuilder()

        .setCustomId("duel_details")

        .setTitle("Duel Details");








        const rounds = new TextInputBuilder()

        .setCustomId("rounds")

        .setLabel("Number of rounds")

        .setStyle(TextInputStyle.Short)

        .setPlaceholder("Example: 5")

        .setRequired(true);







        const server = new TextInputBuilder()

        .setCustomId("server")

        .setLabel("Private Server Link")

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

        interaction.customId === "duel_details"

    ){



        await interaction.deferReply({

            ephemeral:true

        });







        // ANTI SPAM

        if(duelCooldown.has(interaction.user.id)){


            return interaction.editReply({

                content:
                "❌ Please wait before sending another duel request."

            });


        }





        duelCooldown.set(

            interaction.user.id,

            Date.now()

        );





        setTimeout(()=>{


            duelCooldown.delete(interaction.user.id);


        },60000);









        const data =
        duelRequests.get(interaction.user.id);





        if(!data){


            return interaction.editReply({

                content:
                "❌ Duel request expired."

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
                "❌ Enter a valid Roblox private server link."

            });


        }









        const id =
        Date.now().toString();







        activeDuels.set(id,{

            player1: interaction.user.id,

            player2:data.opponent,

            guild:data.guild,

            rounds,

            server,

            roblox

        });








        const opponent =
        await interaction.client.users.fetch(data.opponent);









        const embed = new EmbedBuilder()

        .setColor("#FF0000")

        .setTitle("⚔️ URA DUEL REQUEST")

        .setDescription(

`
You received a duel request from **${interaction.user.username}**

Rounds:
**${rounds}**

Choose your decision.
`

        );









        const buttons = new ActionRowBuilder()

        .addComponents(


            new ButtonBuilder()

            .setCustomId(`accept_duel_${id}`)

            .setLabel("ACCEPT")

            .setStyle(ButtonStyle.Success),




            new ButtonBuilder()

            .setCustomId(`decline_duel_${id}`)

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






            duelRequests.delete(interaction.user.id);






            return interaction.editReply({

                content:
                "✅ Duel request sent!"

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

    startDuel,

    handleDuelInteraction,

    activeDuels

};