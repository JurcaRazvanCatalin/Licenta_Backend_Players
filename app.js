const express = require("express");
const cron = require("node-cron");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const players = require("./Collections/players");
const Players = require("./Collections/Model");
const collectionService = require("./Collections/Service");
require("dotenv").config();
const app = express();
mongoose.set("strictQuery", true);
const PORT = 3000 || process.env.PORT;
const fs = require("fs");

const createPlayer = async (player) => {
  if ((await Players.findOne({ playerName: player.playerName })) == null) {
    collectionService.createRecord(player);
  } else {
    await Players.findOneAndUpdate(
      {
        playerName: player.playerName,
      },
      player,
      {
        new: true,
        runValidators: true,
      }
    );
  }
};

let browser;
const data = [];
const scrapePlayers = async () => {
  try {
    const pages = await browser.newPage();
    for (let i = 1; i <= 4; i++) {
      await pages.goto(
        `https://baschet.ro/liga-nationala-de-baschet-masculin/jucatori?page=${i}`
      );
      const html = await pages.evaluate(() => document.body.innerHTML);
      const $ = await cheerio.load(html);
      fs.writeFileSync("./test.html", html);
      $("ul.players-list > li")
        .map((index, element) => {
          const playerUrl = $($(element).find("a:nth-child(1)")).attr("href");
          data.push({ playerUrl });
        })
        .get();
    }
    return data;
  } catch (err) {
    console.error(err);
  }
};

const scrapeDescriptionPage = async (url, page) => {
  try {
    await page.goto(url, { waitUntil: "networkidle2" });
    const html = await page.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);
    const playerName = $(
      "#app > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1) > div > div.player-profile > img:nth-child(1)"
    ).attr("alt");
    const playerNameSmall = $(
      "#app > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1) > div > div.player-profile > img:nth-child(1)"
    )
      .attr("alt")
      .toLowerCase()
      .replace(" ", "")
      .replace(" ", "")
      .replace("-", "");
    const teamName = $(
      "#app > div:nth-child(2) > div > div > div.team-header > div.text-center > a > img"
    ).attr("alt");
    const playerImg = $(
      "#app > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1) > div > div > img:nth-child(1)"
    ).attr("src");
    const playerCountry = $(
      "#app > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1) > div > div > img.d-inline"
    ).attr("src");
    const position = $(
      "#app > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1) > div > div > h5 > small"
    )
      .text()
      .replace("\n", "")
      .trim();
    const birthday = $(
      "#app > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1) > div > div.player-details > ul > li:nth-child(1)"
    )
      .text()
      .trim();
    let height = $(
      "#app > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(2)"
    )
      .text()
      .trim()
      .replace("cm", "")
      .trim();
    let weight = $(
      "#app > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1) > div > div > ul > li:nth-child(3)"
    )
      .text()
      .trim()
      .replace("kg", "")
      .trim();
    const number = $(
      "#app > div:nth-child(3) > div > div:nth-child(1) > div > div:nth-child(1) > div > div > span"
    )
      .text()
      .replace("#", "");
    const pts_per_game = $(
      "#app > div:nth-child(3) > div > div:nth-child(2) > div > div.col-md-8 > div:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(2)"
    ).text();
    const reb_per_game = $(
      "#app > div:nth-child(3) > div > div:nth-child(2) > div > div.col-md-8 > div:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(3)"
    ).text();
    const ass_per_game = $(
      "#app > div:nth-child(3) > div > div:nth-child(2) > div > div.col-md-8 > div:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(4)"
    ).text();
    const stats = $(
      ".tab-pane.fade.active.show> #average-stats > table > tbody > tr"
    )
      .map((i, Element) => {
        const findYear = $(Element).find(".text-left");
        const year = $(findYear).text();
        const matchPlayed = $($(Element).find("td:nth-child(2)")).text();
        const two_fgm = $($(Element).find("td:nth-child(4)")).text();
        const two_fga = $($(Element).find("td:nth-child(5)")).text();
        const two_fgp = $($(Element).find("td:nth-child(6)"))
          .text()
          .replace("%", "");
        const three_fgm = $($(Element).find("td:nth-child(7)")).text();
        const three_fga = $($(Element).find("td:nth-child(8)")).text();
        const three_fgp = $($(Element).find("td:nth-child(9)"))
          .text()
          .replace("%", "");
        const fta = $($(Element).find("td:nth-child(10)")).text();
        const ftm = $($(Element).find("td:nth-child(11)")).text();
        const ftp = $($(Element).find("td:nth-child(12)"))
          .text()
          .replace("%", "");
        const reb = $($(Element).find("td:nth-child(15)")).text();
        const ass = $($(Element).find("td:nth-child(16)")).text();
        const pts = $($(Element).find("td:nth-child(22)")).text();
        const blocks = $($(Element).find("td:nth-child(21)")).text();
        return {
          year,
          matchPlayed,
          two_fgm,
          two_fga,
          two_fgp,
          three_fgm,
          three_fga,
          three_fgp,
          fta,
          ftm,
          ftp,
          reb,
          ass,
          pts,
          blocks,
        };
      })
      .get();
    const playerInfo = {
      playerName,
      playerNameSmall,
      teamName,
      position,
      playerImg,
      playerCountry,
      birthday,
      height,
      weight,
      number,
      pts_per_game,
      reb_per_game,
      ass_per_game,
      stats,
    };
    createPlayer(playerInfo);
  } catch (err) {
    console.error(err);
  }
};

const main = async () => {
  browser = await puppeteer.launch({ headless: false });
  const descriptionPage = await browser.newPage();
  const players = await scrapePlayers();
  console.log(players.length);
  for (let i = 0; i <= players.length - 1; i++) {
    await scrapeDescriptionPage(players[i].playerUrl, descriptionPage);
  }
};

const startServer = () => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

const database = () => {
  mongoose.connect("mongodb://localhost:27017", () =>
    console.log("Connected to Database")
  );
};

main();

const initRoutes = () => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
  });
  app.use(express.json());
  app.use("/api/v1/players", players);
};

app.get("/", (req, res) => {
  res.send("Jucatori");
});

const startApp = () => {
  startServer();
  database();
  initRoutes();
};

startApp();

// cron.schedule("0/15 * * * * *", main, {});
