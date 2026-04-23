const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ChannelType, 
  PermissionsBitField 
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🔐 TOKEN z Railway Variables
const TOKEN = process.env.TOKEN;

// 👮 SEM DÁŠ ROLE ID VEDENIA
const VEDENIE_ROLE_ID = "SEM_DAJ_ROLE_ID";

client.once('ready', () => {
  console.log(`✅ Bot beží ako ${client.user.tag}`);
});

// 📩 PANEL PRÍKAZ
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content === "!vykupsetup") {

    const embed = new EmbedBuilder()
      .setTitle("🏭 Výkup ocele")
      .setDescription("Klikni na tlačidlo nižšie a vytvor žiadosť o výkup.")
      .setColor("Grey");

    const button = new ButtonBuilder()
      .setCustomId("vykup_ticket")
      .setLabel("📩 Vytvoriť žiadosť")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({ embeds: [embed], components: [row] });
  }
});

// 🎫 TICKET SYSTEM
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "vykup_ticket") {

    const guild = interaction.guild;
    const user = interaction.user;

    const channel = await guild.channels.create({
      name: `vykup-${user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages
          ],
        },
        {
          id: VEDENIE_ROLE_ID,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages
          ],
        }
      ]
    });

    await channel.send(
      `👋 <@${user.id}>  
📦 Napíš koľko ocele máš  
💰 Cena / info`
    );

    await interaction.reply({
      content: `✅ Ticket vytvorený: ${channel}`,
      ephemeral: true
    });
  }
});

client.login(TOKEN);
