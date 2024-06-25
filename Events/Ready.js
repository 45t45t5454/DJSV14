const { ActivityType } = require("discord.js");
const client = require(`${process.cwd()}/index.js`);
const MONGODB_URI = "";
const mongoose = require("mongoose");
const { green, white, italic, bold } = require("colors");
const chalk = require("chalk");

client.on("ready", async () => {
  /*
  if (!MONGODB_URI) return;

  await mongoose.connect(MONGODB_URI || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  if (mongoose.connect) {
    console.log(
      green(bold("[MONGODB DRIVER]")),
      white("The database is running."),
    );
  }
    */

  const activities = [
    {
      name: `Dark`,
      type: ActivityType.Playing,
      
    },
  ];
  const status = ["dnd"]; // buda online, idle veya dnd olduğunu yazıyo
  let i = 0;
  setInterval(() => {
    if (i >= activities.length) i = 0;
    client.user.setActivity(activities[i]);
    i++;
  }, 5000);

  let s = 0;
  setInterval(() => {
    if (s >= activities.length) s = 0;
    client.user.setStatus(status[s]);
    s++;
  }, 30000);

  console.log(chalk.red(`${client.user.tag} İsimli Bot Şuan Aktif!`));
});
