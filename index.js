const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const client = new Client({
  intents: [Object.keys(GatewayIntentBits)],
  partials: [Object.keys(Partials)],
});
require("dotenv").config();
// Çökme engelleyici
process.on("unhandledRejetion", async (reason, promise) => {
  console.log(reason, promise);
});
process.on("uncaughtException", async (err) => {
  console.log(err);
});
process.on("uncaughtExceptMonitor", async (err, origin) => {
  console.log(err, origin);
});

const { Database } = require("nukleon");
const fs = require("fs");
const config = require(`${process.cwd()}/config.json`);
const server = require(`${process.cwd()}/server.js`);

client.commands = new Collection();
client.aliases = new Collection();
client.slashCommands = new Collection();
client.exec = async (code) => {
  return require("child_process").execSync(code).toString();
};
client.db = (fileNameOrPath) => {
  return new Database(`${process.cwd()}/Database/${fileNameOrPath}`);
};

client.classes = (className) => {
  return require(`${process.cwd()}/Classes/${className}`);
};
client.prefix = config.PREFIX;
client.config = config;
module.exports = client;

fs.readdirSync(`${process.cwd()}/Handlers`).forEach((handler) => {
  require(`${process.cwd()}/Handlers/${handler}`)(client);
});

client.login(process.env.TOKEN);



