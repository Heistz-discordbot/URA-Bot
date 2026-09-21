const { Events } = require("discord.js");
const { createBattlePanel } = require("../panels/battlePanel");


module.exports = {

    name: Events.ClientReady,

    once: true,


    async execute(client) {


        console.log(`${client.user.tag} is online!`);



        const channelID = "1533834186199138476";



        try {


            const channel = await client.channels.fetch(channelID);



            if (!channel) {

                console.log("Battle channel not found!");

                return;

            }




            // Delete old Battle Panels

            const messages = await channel.messages.fetch({
                limit: 20
            });



            const oldPanel = messages.find(message =>

                message.author.id === client.user.id &&

                message.embeds.length > 0 &&

                message.embeds[0].title === "URA BATTLE SYSTEM"

            );



            if (oldPanel) {

                await oldPanel.delete();

                console.log("Old Battle Panel deleted!");

            }





            // Send new Battle Panel

            await channel.send(
                createBattlePanel()
            );



            console.log("URA Battle Panel sent successfully!");



        } catch (error) {


            console.log("Error sending Battle Panel:");

            console.error(error);


        }

    }

};