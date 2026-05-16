require("dotenv").config();
const { Client, Intents, MessageEmbed } = require("discord.js");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

const maxMessageCount = parseInt(process.env.MAX_MESSAGE_COUNT);
const stickyMessages = new Map(); // To store sticky messages for each channel

client.once("ready", async () => {
  console.info(`Bot ready! | ${client.user.tag}`);

  // Set custom status
  client.user.setPresence({
    status: 'idle', // 'online', 'idle', 'dnd', or 'invisible'
    activities: [{
      name: 'Tham Gia Cộng Đồng Việt Ngay 🔥', // Custom status message
      type: 'WATCHING' // 'PLAYING', 'STREAMING', 'LISTENING', 'WATCHING', 'COMPETING'
    }],
  });

  // Register slash commands
  try {
    await client.application.commands.set([
      {
        name: 'stick',
        description: 'Lệnh set tin nhắn sticky',
        options: [
          {
            name: 'message',
            description: 'Tin nhắn sticky bạn muốn bot nhắn',
            type: 'STRING',
            required: true,
          },
        ],
      },
      {
        name: 'unstick',
        description: 'Gỡ tin nhắn sticky khỏi kênh đã set trước',
        options: [
          {
            name: 'channel',
            description: 'Kênh mà bạn muốn gỡ sticky',
            type: 'CHANNEL',
            required: true,
          },
        ],
      },
      {
        name: 'list',
        description: 'Lệnh xem các kênh đã set sticky',
      },
      {
        name: 'info',
        description: 'Xem thông tin chủ bot và các thứ khác',
      },
      {
        name: 'ping',
        description: 'Lệnh để bot ping',
      }
    ]);
    console.info('Các lệnh Slash tạo thành công.');
  } catch (error) {
    console.error('Lỗi khi tạo lệnh Slash:', error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "stick") {
    try {
      const channel = interaction.channel;
      const messageContent = options.getString('message');
      
      if (stickyMessages.has(channel.id)) {
        await stickyMessages.get(channel.id).message.delete();
      }

      const stickyMessage = await channel.send(messageContent);
      stickyMessages.set(channel.id, { count: 0, message: stickyMessage });

      await interaction.reply({ content: `Tin nhắn "${messageContent}" đã được set sticky.`, ephemeral: true });
    } catch (error) {
      console.error("Error sticking message:", error);
      await interaction.reply({ content: 'Có lỗi xảy ra khi tạo.', ephemeral: true });
    }
  } else if (commandName === "unstick") {
    try {
      const channel = options.getChannel('channel');
      
      if (stickyMessages.has(channel.id)) {
        await stickyMessages.get(channel.id).message.delete();
        stickyMessages.delete(channel.id);
        await interaction.reply({ content: `Tin nhắn sticky ở <#${channel.id}> đã gỡ.`, ephemeral: true });
      } else {
        await interaction.reply({ content: `Không có tin nhắn sticky nào ở <#${channel.id}>.`, ephemeral: true });
      }
    } catch (error) {
      console.error("Error unsticking message:", error);
      await interaction.reply({ content: 'Có lỗi khi gỡ rồi.', ephemeral: true });
    }
  } else if (commandName === "list") {
    try {
      if (stickyMessages.size > 0) {
        const channelsList = Array.from(stickyMessages.keys()).map(channelId => `<#${channelId}>`).join('\n');
        await interaction.reply({ content: `Đó là các kênh đã set sticky:\n${channelsList}`, ephemeral: true });
      } else {
        await interaction.reply({ content: 'Chưa có kênh nào được set sticky hết.', ephemeral: true });
      }
    } catch (error) {
      console.error("Error listing sticky messages:", error);
      await interaction.reply({ content: 'Có lỗi khi xem các kênh set sticky.', ephemeral: true });
    }
  } else if (commandName === "info") {
    try {
      const embed = new MessageEmbed()
        .setTitle("Bot Information")
        .addField("Bot Tag", client.user.tag, true)
        .addField("Bot ID", client.user.id, true)
        .addField("Owner", `<@${process.env.OWNER}>`, true)
        .addField("Servers", client.guilds.cache.size.toString(), true)
        .addField("Channels", client.channels.cache.size.toString(), true)
        .setColor("BLUE")
        .setFooter("Bot Info", client.user.displayAvatarURL());

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Có lỗi rồi:", error);
      await interaction.reply({ content: 'Có lỗi xảy ra khi cho xem.', ephemeral: true });
    }
  } else if (commandName === "ping") {
    try {
      const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
      const timeTaken = sent.createdTimestamp - interaction.createdTimestamp;
      await interaction.editReply(`Pong! Độ trễ là ${timeTaken}ms. Độ trễ API là ${Math.round(client.ws.ping)}ms.`);
    } catch (error) {
      console.error("Error fetching ping:", error);
      await interaction.reply({ content: 'There was an error fetching the ping.', ephemeral: true });
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const channel = message.channel;
  if (stickyMessages.has(channel.id)) {
    let { count, message: stickyMessage } = stickyMessages.get(channel.id);
    count++;
    if (count >= maxMessageCount) {
      try {
        await stickyMessage.delete();
        stickyMessage = await channel.send(stickyMessage.content);
        count = 0;
        stickyMessages.set(channel.id, { count, message: stickyMessage });
      } catch (error) {
        console.error("Có lỗi khi gửi tin nhắn sticky:", error);
      }
    } else {
      stickyMessages.set(channel.id, { count, message: stickyMessage });
    }
  }
});

client.login(process.env.DISCORD_TOKEN).catch((error) => {
  console.error("Error logging in:", error);
});
