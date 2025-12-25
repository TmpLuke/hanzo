import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, PermissionFlagsBits, ChannelType, ButtonBuilder, ButtonStyle } from 'discord.js';
import { config } from '../config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Send the ticket panel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    // Create the main ticket panel embed
    const embed = new EmbedBuilder()
      .setColor('#1db954')
      .setTitle('🎫 Ticket Centre | Hanzo 🎫')
      .setDescription(
        'Please submit a ticket for any questions or concerns you may have. You can also use the ticket system to purchase any of Hanzo\'s Products. We appreciate your interest and look forward to assisting you promptly.\n\n' +
        '━━━ 💳 Payment Methods ━━━\n\n' +
        '> 🔴 (Credit/Debit Cards)\n' +
        '> 💙 (Paypal, Friends & Family)\n' +
        '> 💚 (Cashapp)\n' +
        '> 🪙 (Cryptocurrencies, BTC, ETH, LTC & More)\n\n' +
        '⚡ https://hanzocheats.com/ ⚡'
      )
      .setThumbnail('https://www.hanzocheats.com/assets/hanzo-logo-DQM325gV.png')
      .setFooter({ text: 'Hanzo | Hanzocheats.com' })
      .setTimestamp();

    // Create dropdown menu with ticket options
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('ticket_select')
      .setPlaceholder('Select a topic')
      .addOptions([
        {
          label: 'Purchase',
          description: 'Click on this option to purchase a product!',
          value: 'purchase',
          emoji: '🛒'
        },
        {
          label: 'Support',
          description: 'Click on this option if you require support!',
          value: 'support',
          emoji: '👤'
        },
        {
          label: 'License Key HWID Reset',
          description: 'Click on this option if you need a Key Reset!',
          value: 'hwid_reset',
          emoji: '🛒'
        },
        {
          label: 'Claim Role / Key',
          description: 'Click here to claim your customer role!',
          value: 'claim_role',
          emoji: '⭐'
        }
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      content: 'Ticket panel sent!',
      ephemeral: true
    });

    await interaction.channel.send({
      embeds: [embed],
      components: [row]
    });
  },
};
