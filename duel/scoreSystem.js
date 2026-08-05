const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

// Map to store match state: matchId -> { player1, player2, score1, score2, rounds }
const activeScores = new Map();

// ==========================================
// PART 1: SCORE MODAL & UPDATING
// ==========================================

/**
 * Opens the score update modal for a player.
 */
async function handleScoreButton(interaction, matchId) {
    const data = activeScores.get(matchId);

    if (!data) {
        return interaction.reply({
            content: "❌ Match data not found or duel has ended.",
            ephemeral: true
        });
    }

    // Verify player participation
    if (interaction.user.id !== data.player1 && interaction.user.id !== data.player2) {
        return interaction.reply({
            content: "❌ You are not a participant in this duel.",
            ephemeral: true
        });
    }

    const modal = new ModalBuilder()
        .setCustomId(`submit_score_modal_${matchId}`)
        .setTitle("Update Your Score");

    const scoreInput = new TextInputBuilder()
        .setCustomId("user_score")
        .setLabel("Your Score")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Enter a number (e.g., 2)")
        .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(scoreInput));
    await interaction.showModal(modal);
}

/**
 * Processes score submissions and updates the compact duel embed.
 */
async function handleScoreSubmit(interaction, matchId) {
    const data = activeScores.get(matchId);

    if (!data) {
        return interaction.reply({
            content: "❌ Match data expired or not found.",
            ephemeral: true
        });
    }

    const inputVal = interaction.fields.getTextInputValue("user_score");
    const newScore = parseInt(inputVal, 10);

    if (isNaN(newScore) || newScore < 0) {
        return interaction.reply({
            content: "❌ Please enter a valid non-negative number.",
            ephemeral: true
        });
    }

    // Each player can ONLY update their own score
    if (interaction.user.id === data.player1) {
        data.score1 = newScore;
    } else if (interaction.user.id === data.player2) {
        data.score2 = newScore;
    }

    activeScores.set(matchId, data);

    // Rebuild the compact embed
    const updatedEmbed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle("URA BATTLEGROUNDS")
        .setDescription(
            `**Match Details**\n` +
            `• **Player 1:** <@${data.player1}> — Score: **${data.score1}**\n` +
            `• **Player 2:** <@${data.player2}> — Score: **${data.score2}**\n` +
            `• **Rounds:** ${data.rounds}`
        );

    await interaction.message.edit({ embeds: [updatedEmbed] });

    return interaction.reply({
        content: `✅ Your score has been updated to **${newScore}**!`,
        ephemeral: true
    });
}

// ==========================================
// PART 2: END DUEL & DELETE CHANNEL WORKFLOW
// ==========================================

/**
 * Disables the option buttons and reveals the "Delete Channel" button.
 */
async function handleEndDuel(interaction, matchId) {
    const data = activeScores.get(matchId);

    if (!data) {
        return interaction.reply({
            content: "❌ Match data not found.",
            ephemeral: true
        });
    }

    if (interaction.user.id !== data.player1 && interaction.user.id !== data.player2) {
        return interaction.reply({
            content: "❌ Only duel participants can end the match.",
            ephemeral: true
        });
    }

    // Row with active Delete Channel button
    const endRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`delete_channel_${matchId}`)
            .setLabel("Delete Channel")
            .setStyle(ButtonStyle.Danger)
    );

    await interaction.update({
        content: "🛑 **Duel Ended.** Click below to permanently delete this channel.",
        components: [endRow]
    });
}

/**
 * Permanently deletes the channel when "Delete Channel" is clicked.
 */
async function handleDeleteChannel(interaction, matchId) {
    activeScores.delete(matchId);

    await interaction.reply({
        content: "🗑️ Deleting channel in 3 seconds..."
    });

    setTimeout(() => {
        interaction.channel.delete().catch(console.error);
    }, 3000);
}

module.exports = {
    activeScores,
    handleScoreButton,
    handleScoreSubmit,
    handleEndDuel,
    handleDeleteChannel
};
