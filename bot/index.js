import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from './config.js';
import { registerCommands } from './deploy-commands.js';
import { loadCommands } from './utils/commandLoader.js';
import './healthcheck.js'; // Keep Railway happy

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

// Initialize commands collection
client.commands = new Collection();

// Load all commands
loadCommands(client);

// Ready event
client.once('ready', async () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
  console.log(`📊 Serving ${client.guilds.cache.size} servers`);
  
  // Set bot status
  client.user.setActivity('Hanzo Marketplace', { type: 'WATCHING' });
});

// Handle interactions (commands, buttons, modals)
client.on('interactionCreate', async (interaction) => {
  // Handle slash commands
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}:`, error);
      
      const errorMessage = {
        content: '❌ There was an error executing this command!',
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  }

  // Handle button interactions
  if (interaction.isButton()) {
    if (interaction.customId === 'redeem_button') {
      const { handleRedeemButton } = await import('./commands/redeem.js');
      await handleRedeemButton(interaction);
    }
  }

  // Handle modal submissions
  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'redeem_modal') {
      const { handleRedeemModal } = await import('./commands/redeem.js');
      await handleRedeemModal(interaction);
    }
  }
});

// Login to Discord
client.login(config.token).catch((error) => {
  console.error('❌ Failed to login:', error);
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down bot...');
  client.destroy();
  process.exit(0);
});
