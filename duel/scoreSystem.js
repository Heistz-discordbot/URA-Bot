const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");


const activeScores = new Map();


// =====================
// UPDATE SCORE BUTTON
// =====================

async function handleScoreButton(interaction, matchId) {

    console.log("UPDATE SCORE CLICKED:", matchId);

    const data = activeScores.get(matchId);

    if (!data) {

        console.log("NO MATCH DATA:", matchId);

        return interaction.reply({
            content: "❌ Match data was not found.",
            ephemeral: true
        });
    }


    if (
        interaction.user.id !== data.player1 &&
        interaction.user.id !== data.player2
    ) {

        return interaction.reply({
            content: "❌ You are not a player in this match.",
            ephemeral: true
        });
    }


    const modal = new ModalBuilder()
        .setCustomId(`submit_score_modal_${matchId}`)
        .setTitle("Update Your Score");


    const scoreInput = new TextInputBuilder()
        .setCustomId("user_score")
        .setLabel("Your Score")
        .setPlaceholder("Enter your score")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);


    modal.addComponents(
        new ActionRowBuilder()
            .addComponents(scoreInput)
    );


    await interaction.showModal(modal);

    console.log("SCORE MODAL OPENED:", matchId);
}


// =====================
// SUBMIT SCORE
// =====================

async function handleScoreSubmit(interaction, matchId) {

    console.log("SCORE SUBMITTED:", matchId);


    const data = activeScores.get(matchId);


    if (!data) {

        return interaction.reply({
            content: "❌ Match data was not found.",
            ephemeral: true
        });
    }


    const scoreText =
        interaction.fields.getTextInputValue("user_score");


    const score =
        Number(scoreText);


    if (
        !Number.isInteger(score) ||
        score < 0
    ) {

        return interaction.reply({
            content: "❌ Enter a valid score.",
            ephemeral: true
        });
    }


    // =====================
    // PLAYER 1
    // =====================

    if (interaction.user.id === data.player1) {

        data.pendingScore1 = score;

        data.player1Uploaded = true;

    }


    // =====================
    // PLAYER 2
    // =====================

    else if (interaction.user.id === data.player2) {

        data.pendingScore2 = score;

        data.player2Uploaded = true;

    }


    else {

        return interaction.reply({
            content: "❌ You are not a player in this match.",
            ephemeral: true
        });
    }


    activeScores.set(matchId, data);


    // =====================
    // BOTH PLAYERS UPLOADED
    // =====================

    if (
        data.player1Uploaded &&
        data.player2Uploaded
    ) {

        data.score1 =
            data.pendingScore1;

        data.score2 =
            data.pendingScore2;


        data.player1Uploaded = false;
        data.player2Uploaded = false;


        activeScores.set(matchId, data);


        const embed =
            new EmbedBuilder()

                .setColor("#FF0000")

                .setTitle("URA BATTLEGROUNDS")

                .setDescription(
`**Match Details**

• **Player 1:** <@${data.player1}> — **${data.score1}**
• **Player 2:** <@${data.player2}> — **${data.score2}**
• **Rounds:** **${data.rounds}**

📝 Be honest with your score.`
                );


        const channel =
            await interaction.client.channels.fetch(
                data.channelId
            );


        const messages =
            await channel.messages.fetch({
                limit: 20
            });


        const matchMessage =
            messages.find(
                message =>
                    message.author.id === interaction.client.user.id &&
                    message.embeds.length > 0 &&
                    message.embeds[0].title === "URA BATTLEGROUNDS"
            );


        if (matchMessage) {

            await matchMessage.edit({
                embeds: [embed]
            });

        }


        return interaction.reply({
            content: "✅ Both players have uploaded their scores.",
            ephemeral: true
        });
    }


    // =====================
    // ONLY ONE UPLOADED
    // =====================

    return interaction.reply({
        content: "✅ Your score has been uploaded. Waiting for the other player.",
        ephemeral: true
    });
}


// =====================
// END DUEL
// =====================

async function handleEndDuel(interaction, matchId) {

    const data =
        activeScores.get(matchId);


    if (!data) {

        return interaction.reply({
            content: "❌ Match data was not found.",
            ephemeral: true
        });
    }


    if (
        interaction.user.id !== data.player1 &&
        interaction.user.id !== data.player2
    ) {

        return interaction.reply({
            content: "❌ Only the players can end this match.",
            ephemeral: true
        });
    }


    const embed =
        new EmbedBuilder()

            .setColor("#FF0000")

            .setTitle("URA DUEL")

            .setDescription(
`⚔ **Final Score**

<@${data.player1}> — **${data.score1}**
<@${data.player2}> — **${data.score2}**`
            );


    const row =
        new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                    .setCustomId(
                        `delete_channel_${matchId}`
                    )
                    .setLabel("DELETE CHANNEL")
                    .setStyle(ButtonStyle.Danger)

            );


    await interaction.update({

        embeds: [embed],

        components: [row]

    });
}


// =====================
// DELETE CHANNEL
// =====================

async function handleDeleteChannel(
    interaction,
    matchId
) {

    const data =
        activeScores.get(matchId);


    if (!data) {

        return interaction.reply({
            content: "❌ Match data was not found.",
            ephemeral: true
        });
    }


    if (
        interaction.user.id !== data.player1 &&
        interaction.user.id !== data.player2
    ) {

        return interaction.reply({
            content: "❌ Only the players can delete this channel.",
            ephemeral: true
        });
    }


    activeScores.delete(matchId);


    await interaction.reply({
        content: "🗑️ Deleting channel..."
    });


    setTimeout(() => {

        interaction.channel
            .delete()
            .catch(console.error);

    }, 1500);
}


module.exports = {

    activeScores,

    handleScoreButton,

    handleScoreSubmit,

    handleEndDuel,

    handleDeleteChannel

};