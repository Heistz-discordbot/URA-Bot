const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder
} = require("discord.js");

const path = require("path");

function createBattlePanel() {

    const banner = new AttachmentBuilder(
        path.join(__dirname, "../assets/battle-banner.png"),
        { name: "battle-banner.png" }
    );

    const embed = new EmbedBuilder()
        .setColor("#E53935")
        .setTitle("URA BATTLE SYSTEM")

        .setDescription(
`Select your path into the arena.

**⚔ DUEL**
Competitive • Ranked

Challenge an opponent and prove your strength.
Every victory counts towards your record.

**🥊 SPAR**
Casual • Practice

Train your combos and improve your skills
without affecting your rank.

Choose a mode below to begin.`
        )

        // Image appears directly below the title area
        .setThumbnail("attachment://battle-banner.png");

    const row = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId("duel")
                .setLabel("DUEL")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("spar")
                .setLabel("SPAR")
                .setStyle(ButtonStyle.Primary)

        );

    return {
        embeds: [embed],
        components: [row],
        files: [banner]
    };
}

module.exports = {
    createBattlePanel
};
