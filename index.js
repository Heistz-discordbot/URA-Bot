const { 
    Client, 
    GatewayIntentBits, 
    Collection 
} = require("discord.js");

const fs = require("fs");

require("dotenv").config();



const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages

    ]

});



client.commands = new Collection();




// =====================
// LOAD COMMANDS
// =====================

const commandFiles = fs.readdirSync("./commands")
    .filter(file => file.endsWith(".js"));


for (const file of commandFiles) {

    const command = require(`./commands/${file}`);

    client.commands.set(
        command.data.name,
        command
    );

}




// =====================
// READY EVENT
// =====================

const readyEvent = require("./events/ready");


client.once(

    readyEvent.name,

    (...args)=>readyEvent.execute(...args)

);






// =====================
// SPAR SYSTEM
// =====================

const {

    startSpar,
    handleSparInteraction,
    activeSpars

} = require("./systems/sparSystem");



const {

    createSparTicket

} = require("./tickets/sparTicket");






// =====================
// DUEL SYSTEM
// =====================

const {

    startDuel,
    handleDuelInteraction,
    activeDuels

} = require("./systems/duelSystem");



const {

    createDuelTicket

} = require("./tickets/duelTicket");









client.on("interactionCreate", async interaction => {



    console.log(

        "Interaction:",

        interaction.type,

        interaction.customId

    );




    try {





        // =====================
        // SLASH COMMANDS
        // =====================

        if(interaction.isChatInputCommand()){


            const command =
            client.commands.get(
                interaction.commandName
            );


            if(!command) return;



            await command.execute(interaction);


            return;

        }








        // =====================
        // DUEL BUTTON
        // =====================

        if(

            interaction.isButton() &&

            interaction.customId === "duel"

        ){

            await startDuel(interaction);

            return;

        }







        // =====================
        // SPAR BUTTON
        // =====================

        if(

            interaction.isButton() &&

            interaction.customId === "spar"

        ){

            await startSpar(interaction);

            return;

        }







        // =====================
        // DUEL SELECT
        // =====================

        if(

            interaction.isUserSelectMenu() &&

            interaction.customId === "duel_select_player"

        ){

            await handleDuelInteraction(interaction);

            return;

        }







        // =====================
        // SPAR SELECT
        // =====================

        if(

            interaction.isUserSelectMenu() &&

            interaction.customId === "spar_select_player"

        ){

            await handleSparInteraction(interaction);

            return;

        }







        // =====================
        // DUEL MODAL
        // =====================

        if(

            interaction.isModalSubmit() &&

            interaction.customId === "duel_details"

        ){

            await handleDuelInteraction(interaction);

            return;

        }







        // =====================
        // SPAR MODAL
        // =====================

        if(

            interaction.isModalSubmit() &&

            interaction.customId === "spar_details"

        ){

            await handleSparInteraction(interaction);

            return;

        }










        // =====================
        // ACCEPT SPAR
        // =====================

        if(

            interaction.isButton() &&

            interaction.customId.startsWith("accept_spar_")

        ){



            const id =
            interaction.customId.split("_")[2];



            const data =
            activeSpars.get(id);




            if(!data){

                return interaction.reply({

                    content:"❌ Spar expired.",

                    ephemeral:true

                });

            }




            const guild =
            await client.guilds.fetch(data.guild);



            const player1 =
            await client.users.fetch(data.player1);




            await interaction.update({

                content:
                "✅ Spar accepted! Creating ticket...",

                embeds:[],

                components:[]

            });





            await createSparTicket(

                client,

                guild,

                player1,

                interaction.user,

                data.rounds,

                data.server,

                data.roblox

            );


            return;


        }









        // =====================
        // ACCEPT DUEL
        // =====================

        if(

            interaction.isButton() &&

            interaction.customId.startsWith("accept_duel_")

        ){



            const id =
            interaction.customId.split("_")[2];



            const data =
            activeDuels.get(id);




            if(!data){


                return interaction.reply({

                    content:
                    "❌ Duel expired.",

                    ephemeral:true

                });


            }






            const guild =
            await client.guilds.fetch(data.guild);





            const player1 =
            await client.users.fetch(data.player1);






            await interaction.update({

                content:
                "✅ Duel accepted! Creating ticket...",

                embeds:[],

                components:[]

            });






            await createDuelTicket(

                client,

                guild,

                player1,

                interaction.user,

                data.rounds,

                data.server,

                data.roblox

            );



            return;


        }









        // =====================
        // DECLINE BUTTONS
        // =====================

        if(

            interaction.isButton() &&

            (

            interaction.customId.startsWith("decline_spar_") ||

            interaction.customId.startsWith("decline_duel_")

            )

        ){



            await interaction.update({

                content:"❌ Request declined.",

                embeds:[],

                components:[]

            });



            return;

        }








    } catch(error){


        console.log(error);



        if(

            !interaction.replied &&

            !interaction.deferred

        ){

            await interaction.reply({

                content:
                "❌ Something went wrong.",

                ephemeral:true

            });

        }


    }



});






client.login(process.env.TOKEN);