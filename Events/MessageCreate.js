const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  Collection,
  PermissionsBitField,
} = require("discord.js");
const ms = require("ms");
const client = require(`${process.cwd()}/index.js`);
const config = require(`${process.cwd()}/config.json`);

const prefix = client.prefix;
const cooldown = new Collection();

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type !== 0) return;
  if (!message.content.toLowerCase().startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;
  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command.settings) {
    if (command.settings.disabled) {
      if (!config.OWNERS.includes(message.author.id || message.member.id)) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "Bu komut developerlar tarafından devre dışı bırakılmış durumdadır.",
          );
        return message
          .reply({
            embeds: [embed],
          })
          .then((x) => {
            setTimeout(async () => {
              await x.delete();
            }, 5 * 1000);
          });
      }
    }
  }

  if (command) {
    if (command.cooldown) {
      if (cooldown.has(`${command.name}${message.author.id}`))
        return message.channel.send({
          content: config.MESSAGES["COOLDOWN_MESSAGE"].replace(
            "<duration>",
            ms(
              cooldown.get(`${command.name}${message.author.id}`) - Date.now(),
              { long: true },
            ),
          ),
        });
      if (command.userPerms || command.botPerms) {
        if (
          !message.member.permissions.has(
            PermissionsBitField.resolve(command.userPerms || []),
          )
        ) {
          const userPerms = new EmbedBuilder()
            .setDescription(
              `🚫 ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`,
            )
            .setColor("Red");
          return message.reply({ embeds: [userPerms] });
        }
        if (
          !message.guild.members.cache
            .get(client.user.id)
            .permissions.has(
              PermissionsBitField.resolve(command.botPerms || []),
            )
        ) {
          const botPerms = new EmbedBuilder()
            .setDescription(
              `🚫 ${message.author}, I don't have \`${command.botPerms}\` permissions to use this command!`,
            )
            .setColor("Red");
          return message.reply({ embeds: [botPerms] });
        }
      }

      command.run(client, message, args);
      cooldown.set(
        `${command.name}${message.author.id}`,
        Date.now() + command.cooldown,
      );
      setTimeout(() => {
        cooldown.delete(`${command.name}${message.author.id}`);
      }, command.cooldown);
    } else {
      if (command.userPerms || command.botPerms) {
        if (
          !message.member.permissions.has(
            PermissionsBitField.resolve(command.userPerms || []),
          )
        ) {
          const userPerms = new EmbedBuilder()
            .setDescription(
              `🚫 ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`,
            )
            .setColor("Red");
          return message.reply({ embeds: [userPerms] });
        }

        if (
          !message.guild.members.cache
            .get(client.user.id)
            .permissions.has(
              PermissionsBitField.resolve(command.botPerms || []),
            )
        ) {
          const botPerms = new EmbedBuilder()
            .setDescription(
              `🚫 ${message.author}, I don't have \`${command.botPerms}\` permissions to use this command!`,
            )
            .setColor("Red");
          return message.reply({ embeds: [botPerms] });
        }
      }
      command.run(client, message, args);
    }
  }
});
