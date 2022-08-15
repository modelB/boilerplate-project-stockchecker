"use strict";

const { default: axios } = require("axios");
const { dbController } = require("../controllers/db-controller");
const bcrypt = require("bcrypt");
const { db } = require("../db-connect");
const { hashCode } = require("../utils");

module.exports = function (app) {
  app.route("/api/stock-prices").get(async (req, res) => {
    let { stock: stocks, like } = req.query;
    if (typeof stocks === "string") stocks = [stocks];
    if (stocks) {
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const hashedIp = hashCode(ip);
      console.log(hashedIp)
      const stockPriceData = await Promise.all(
        stocks.map((stock) =>
          axios
            .get(
              `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
            )
            .catch((err) => null)
        )
      );
      const stockDbData = await Promise.all(
        stocks.map((stock) => dbController.findStock(stock))
      );
      // console.log(stockDbData);
      for (let i = 0; i < stocks.length; i++) {
        if (!stockDbData[i]) {

          console.log("NO STOCK FOUND IN DB");
          const likingIps = like === "true" ? [hashedIp] : [];
          await dbController.createStock(stocks[i], likingIps);
          stockDbData[i] = { stock: stocks[i], likingIps };
        } else {
          console.log("STOCK FOUND IN DB");
          console.log(stockDbData[i])
          const likingIps = stockDbData[i].likingIps;
          if (like === "true" && !likingIps.includes(hashedIp)) {
            console.log("NEW LIKE");
            likingIps.push(hashedIp);
            console.log("LIKING IPS", likingIps);

            await dbController.updateStock(stockDbData[i].stock, likingIps);
            console.log('FINISHED UPDATING');
            stockDbData[i].likingIps = likingIps;
          }
        }
      }

      res.status(200).send(
        stocks.length === 1
          ? {
              stockData: {
                stock: stocks[0].toUpperCase(),
                price: stockPriceData[0].data.latestPrice,
                likes: stockDbData[0].likingIps.length,
              },
            }
          : {
              stockData: stocks.map((stock, i) => ({
                stock: stock.toUpperCase(),
                price: stockPriceData[i].data.latestPrice,
                rel_likes:
                  stockDbData[i].likingIps.length -
                  stockDbData[(i + 1) % 2].likingIps.length,
              })),
            }
      );
    } else res.send(400);
  });
};
