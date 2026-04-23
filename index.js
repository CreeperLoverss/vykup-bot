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

// 🔐 TOKEN (Railway Variable)
const TOKEN = process.env.TOKEN;

// 👮 ROLE VEDENIA
const VEDENIE_ROLE_ID = "1489760336528675027";

// 📁 KATEGÓRIA VÝKUP OCELE
const CATEGORY_ID = "1496821115505479751";

client.once("ready", () => {
  console.log(`✅ STEELCORE BOT ONLINE: ${client.user.tag}`);
});

// 📩 MESSAGE COMMANDS
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // 🧾 SETUP PANEL
  if (message.content === "!vykupsetup") {

    const embed = new EmbedBuilder()
      .setTitle("🏭 STEELCORE INDUSTRIES")
      .setDescription(`
📦 VÝKUP OCELE

────────────────────────

🧾 Oficiálny systém spracovania a výkupu ocele spoločnosti SteelCore.

⏱️ Systém je aktívny 24/7  
📊 Každá žiadosť je spracovaná vedením

────────────────────────

👉 Klikni na tlačidlo nižšie a vytvor žiadosť o výkup.
`)
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

  // 💰 VÝKUP KALKULÁTOR
  if (message.content.startsWith("!vykup ")) {

    const args = message.content.split(" ");
    const amount = parseInt(args[1]);

    if (isNaN(amount)) {
      return message.reply("❌ Použitie: `!vykup <množstvo>` (napr. !vykup 100)");
    }

    const pricePerUnit = 100;
    const total = amount * pricePerUnit;

    return message.reply(
      `🏭 VÝKUP OCELE\n\n` +
      `📦 Množstvo: **${amount} kusov**\n` +
      `💰 Cena za kus: **$${pricePerUnit}**\n` +
      `────────────────────\n` +
      `💵 CELKOM: **$${total}**`
    );
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
      parent: CATEGORY_ID,

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

    await channel.send(`👋 <@${user.id}>

📦 Napíš !vykup + množstvo ocele, ktoré chceš predať  
💰 Cena: **$100 za kus**
`);

    await interaction.reply({
      content: `✅ Výkup žiadosť vytvorená: ${channel}`,
      ephemeral: true
    });
  }
});

client.login(TOKEN);
