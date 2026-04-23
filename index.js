const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🔐 TOKEN z Railway Variables
const TOKEN = process.env.TOKEN;

// 👮 ROLE VEDENIA (SEM DÁŠ ID ROLE)
const VEDENIE_ROLE_ID = "1489760336528675027";

// 📁 KATEGÓRIA VÝKUP OCELE (SEM DÁŠ CATEGORY ID)
const CATEGORY_ID = "1496821115505479751";

client.once("ready", () => {
  console.log(`✅ Výkup bot beží ako ${client.user.tag}`);
});

// 📩 PANEL
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!vykupsetup") {

    const embed = new EmbedBuilder()
      .setTitle("🏭 Výkup ocele")
      .setDescription("Klikni na tlačidlo a vytvor žiadosť o výkup.")
      .setColor("Grey");

    const button = new ButtonBuilder()
      .setCustomId("vykup_ticket")
      .setLabel("📩 Vytvoriť žiadosť")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
});

// 🎫 TICKET SYSTEM
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "vykup_ticket") {

    const guild = interaction.guild;
    const user = interaction.user;

    const channel = await guild.channels.create({
      name: `vykup-${user.username}`,
      type: ChannelType.GuildText,

      parent: CATEGORY_ID, // 🔥 TU IDE KATEGÓRIA

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
💰 Tvoja cena / ponuka
📝 poznámka`
    );

    await interaction.reply({
      content: `✅ Vytvorený výkup ticket: ${channel}`,
      ephemeral: true
    });
  }
});

client.login(TOKEN);
