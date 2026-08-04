// ==================================
// URA DUEL SYSTEM
// duels.js
// PART 1/5
// ==================================


const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    UserSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");




// ACTIVE DUELS STORAGE

const duelData = new Map();






// ==================================
// DUEL START BUTTON
// ==================================


async function startDuel(interaction){


    const embed =
    new EmbedBuilder()

    .setColor("#ff0000")

    .setTitle(
        "⚔️ Select Your Opponent"
    )

    .setDescription(

`
Choose a fighter to challenge.

Use the dropdown to select a member.

Or use search if you cannot find them.
`

    );





    const userMenu =
    new UserSelectMenuBuilder()

    .setCustomId(
        "select_opponent"
    )

    .setPlaceholder(
        "🥊 Choose your opponent"
    )

    .setMinValues(1)

    .setMaxValues(1);






    const searchButton =
    new ButtonBuilder()

    .setCustomId(
        "search_player"
    )

    .setLabel(
        "🔍 Search Player"
    )

    .setStyle(
        ButtonStyle.Primary
    );






    const row1 =
    new ActionRowBuilder()

    .addComponents(
        userMenu
    );



    const row2 =
    new ActionRowBuilder()

    .addComponents(
        searchButton
    );







    await interaction.reply({

        embeds:[
            embed
        ],

        components:[
            row1,
            row2
        ],

        ephemeral:true

    });



}







// ==================================
// BUTTON HANDLER
// ==================================


async function handleButtons(interaction){



    const id =
    interaction.customId;





    // DUEL BUTTON

    if(id === "duel_start"){

        return startDuel(
            interaction
        );

    }






    // SEARCH BUTTON


    if(id === "search_player"){



        const modal =
        new ModalBuilder()

        .setCustomId(
            "player_search_modal"
        )

        .setTitle(
            "Search Player"
        );





        const input =
        new TextInputBuilder()

        .setCustomId(
            "username"
        )

        .setLabel(
            "Enter Discord username"
        )

        .setStyle(
            TextInputStyle.Short
        )

        .setRequired(true);






        const row =
        new ActionRowBuilder()

        .addComponents(
            input
        );




        modal.addComponents(
            row
        );



        return interaction.showModal(
            modal
        );


    }







    // SPAR


    if(id === "spar_start"){


        return interaction.reply({

            content:
            "🥊 Spar mode coming soon!",

            ephemeral:true

        });


    }



}









// ==================================
// USER SELECT MENU
// ==================================


async function handleSelect(interaction){



    if(
        interaction.customId !==
        "select_opponent"
    )
    return;



    const opponent =
    interaction.values[0];




    duelData.set(

        interaction.user.id,

        {

            opponent:opponent

        }

    );





    const member =
    await interaction.guild.members.fetch(
        opponent
    );





    const embed =
    new EmbedBuilder()

    .setColor("#ff0000")

    .setTitle(
        "🥊 Opponent Selected"
    )

    .setDescription(

`
Challenger:

${interaction.user}


Opponent:

${member.user}

Preparing duel...
`

    );





    await interaction.update({

        embeds:[
            embed
        ],

        components:[]

    });



}






module.exports = {

    startDuel,

    handleButtons,

    handleSelect,

    duelData

};
// ==================================
// PART 2/5
// ROUNDS + DM CHALLENGE SYSTEM
// ==================================



const {
    StringSelectMenuBuilder
} = require("discord.js");





// ==================================
// AFTER OPPONENT SELECTED
// ==================================


async function askRounds(interaction){



const duel =
duelData.get(
    interaction.user.id
);



if(!duel){

return interaction.reply({

content:
"❌ Duel session expired.",

ephemeral:true

});

}




const roundMenu =
new StringSelectMenuBuilder()

.setCustomId(
"select_rounds"
)

.setPlaceholder(
"🏆 Choose rounds"
)

.addOptions(

{

label:"1 Round",

value:"1"

},


{

label:"3 Rounds",

value:"3"

},


{

label:"5 Rounds",

value:"5"

},


{

label:"10 Rounds",

value:"10"

}

);




const row =
new ActionRowBuilder()

.addComponents(
    roundMenu
);





return interaction.editReply({

embeds:[

new EmbedBuilder()

.setColor("#ff0000")

.setTitle(
"🏆 Select Match Rounds"
)

.setDescription(
`
Opponent selected.

Choose how many rounds this battle will have.
`

)

],

components:[row]

});

}





// ==================================
// ROUND SELECT
// ==================================


async function handleRounds(interaction){



if(
interaction.customId !==
"select_rounds"
)

return;




const rounds =
interaction.values[0];



const duel =
duelData.get(
    interaction.user.id
);



if(!duel)
return;





duel.rounds =
rounds;





const opponent =
await interaction.guild.members.fetch(
    duel.opponent
);






duel.challenger =
interaction.user.id;





duelData.set(

interaction.user.id,

duel

);





const accept =
new ButtonBuilder()

.setCustomId(
`accept_duel_${interaction.user.id}`
)

.setLabel(
"✅ Accept"
)

.setStyle(
ButtonStyle.Success
);




const decline =
new ButtonBuilder()

.setCustomId(
`decline_duel_${interaction.user.id}`
)

.setLabel(
"❌ Decline"
)

.setStyle(
ButtonStyle.Danger
);





const buttons =
new ActionRowBuilder()

.addComponents(
accept,
decline
);






const dmEmbed =
new EmbedBuilder()

.setColor("#ff0000")

.setTitle(
"⚔️ URA Duel Request"
)

.setDescription(

`
You have been challenged!


🥊 Challenger:

${interaction.user}


🏆 Rounds:

${rounds}


Accept the battle or decline.
`

);






try{



await opponent.send({

embeds:[dmEmbed],

components:[buttons]

});




await interaction.update({

content:
"📩 Duel request sent!",

embeds:[],

components:[]

});



}

catch(error){


await interaction.update({

content:
"❌ Cannot DM this player.",

components:[]

});


}



}









// ==================================
// ACCEPT / DECLINE
// ==================================


async function handleDMButtons(interaction){



const id =
interaction.customId;



if(
id.startsWith(
"decline_duel_"
)
){


return interaction.update({

embeds:[

new EmbedBuilder()

.setColor("#ff0000")

.setTitle(
"❌ Duel Declined"
)

.setDescription(
"This duel request was declined."
)

],

components:[]

});


}






if(
id.startsWith(
"accept_duel_"
)
){



const challenger =
id.replace(
"accept_duel_",
""
);





return interaction.update({

embeds:[

new EmbedBuilder()

.setColor("#00ff00")

.setTitle(
"✅ Duel Accepted"
)

.setDescription(
"Creating duel arena..."
)

],

components:[]

});



}



}
// ==================================
// PART 4/5
// SCORE + END DUEL SYSTEM
// ==================================



async function updateScore(interaction){



const duel =
[...duelData.values()].find(

d =>
d.channel === interaction.channel.id

);



if(!duel){

return interaction.reply({

content:
"❌ Duel session not found.",

ephemeral:true

});

}






const embed =
new EmbedBuilder()

.setColor("#ffaa00")

.setTitle(
"📊 Update Score"
)

.setDescription(

`
Choose the winner of this round.

⚔️ Select below:
`

);






const row =
new ActionRowBuilder()

.addComponents(



new ButtonBuilder()

.setCustomId(
"score_challenger"
)

.setLabel(
"🥊 Challenger +1"
)

.setStyle(
ButtonStyle.Primary
),



new ButtonBuilder()

.setCustomId(
"score_opponent"
)

.setLabel(
"🥊 Opponent +1"
)

.setStyle(
ButtonStyle.Secondary
)



);





return interaction.reply({

embeds:[embed],

components:[row],

ephemeral:true

});

}








// ==================================
// SCORE BUTTONS
// ==================================


async function handleScoreButtons(interaction){



const duel =
[...duelData.values()].find(

d =>
d.channel === interaction.channel.id

);




if(!duel)
return;






if(
interaction.customId ===
"score_challenger"
){


duel.score1++;

}





if(
interaction.customId ===
"score_opponent"
){


duel.score2++;

}






const embed =
new EmbedBuilder()

.setColor("#ff0000")

.setTitle(
"⚔️ URA DUEL"
)

.setDescription(

`
🥊 Fighters


🏆 Score

${duel.score1} - ${duel.score2}


⚔️ Match Active
`

);






await interaction.channel.send({

embeds:[embed]

});





return interaction.update({

content:
"✅ Score updated",

embeds:[],

components:[]

});



}









// ==================================
// END DUEL
// ==================================


async function endDuel(interaction){



const duel =
[...duelData.values()].find(

d =>
d.channel === interaction.channel.id

);



if(!duel)
return;






await interaction.channel.permissionOverwrites.edit(

interaction.guild.roles.everyone,

{

ViewChannel:false

}

);







const deleteButton =
new ActionRowBuilder()

.addComponents(

new ButtonBuilder()

.setCustomId(
"delete_duel_channel"
)

.setLabel(
"🗑️ Delete Channel"
)

.setStyle(
ButtonStyle.Danger
)

);







return interaction.channel.send({

embeds:[

new EmbedBuilder()

.setColor("#00ff00")

.setTitle(
"🏆 Duel Ended"
)

.setDescription(

`
Final Score:

${duel.score1} - ${duel.score2}


Channel locked.

Use delete button when finished.
`

)

],

components:[
deleteButton
]

});

}








// ==================================
// DELETE CHANNEL
// ==================================


async function deleteDuelChannel(interaction){



if(
interaction.customId !==
"delete_duel_channel"
)

return;



await interaction.reply({

content:
"🗑️ Deleting duel channel...",

ephemeral:true

});



setTimeout(()=>{


interaction.channel.delete()
.catch(()=>{});


},3000);



}
// ==================================
// PART 5/5
// FINAL HANDLER CONNECTIONS
// ==================================



async function handleSelectMenu(interaction){


    if(
        interaction.customId === "select_opponent"
    ){

        return handleSelect(interaction);

    }




    if(
        interaction.customId === "select_rounds"
    ){

        return handleRounds(interaction);

    }

}






async function handleModal(interaction){


    if(
        interaction.customId !==
        "player_search_modal"
    )
    return;



    const username =
    interaction.fields.getTextInputValue(
        "username"
    );



    const member =
    interaction.guild.members.cache.find(

        m =>
        m.user.username
        .toLowerCase()
        ===
        username.toLowerCase()

    );





    if(!member){


        return interaction.reply({

            content:
            "❌ Player not found.",

            ephemeral:true

        });

    }





    duelData.set(

        interaction.user.id,

        {

            opponent:
            member.id

        }

    );





    return askRounds(interaction);


}








// ==================================
// ACCEPT / DECLINE + BUTTON ROUTER
// ==================================


const oldHandleButtons =
handleButtons;




handleButtons = async function(interaction){



    const id =
    interaction.customId;





    if(
        id.startsWith(
        "accept_duel_"
        )
        ||
        id.startsWith(
        "decline_duel_"
        )
    ){

        return handleDMButtons(
            interaction
        );

    }





    if(
        id === "update_score"
        ||
        id === "score_challenger"
        ||
        id === "score_opponent"
    ){

        return handleScoreButtons(
            interaction
        );

    }






    if(
        id === "end_duel"
    ){

        return endDuel(
            interaction
        );

    }






    if(
        id === "delete_duel_channel"
    ){

        return deleteDuelChannel(
            interaction
        );

    }





    return oldHandleButtons(
        interaction
    );


};









module.exports = {


    startDuel,

    handleButtons,

    handleSelectMenu,

    handleModal,


    duelData

};