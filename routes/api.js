"use strict";

const { default: axios } = require("axios");
const { dbController } = require("../controllers/db-controller");
const bcrypt = require("bcrypt");

module.exports = function (app) {
  app.route("/api/stock-prices").get(async (req, res) => {
    const { stock: stocks, like } = req.query;
    const existingUser = await dbController.findUser(hashedIp);
    if (stocks.length === 1) {
      const stock = stocks[0];
      const stockPriceRes = (
        await axios.get(
          `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
        )
      ).data;
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      let hashedIp;
      bcrypt.hash(ip, 13, (err, hash) => {
        hashedIp = hash;
      });
      let existingStock = await dbController.findStock(stock);
      if (!existingStock) {
        existingStock = { ticker: stock, likes: 0 };
        await dbController.createStock(stock, 0);
      }
      console.log("existingUSer:", existingUser);
      console.log("existingStock", existingStock);
      let likes = existingStock.likes;

      // console.log("existinguser likedstocks:", existingUser && existingUser.liked_stocks.includes(stock));
      if (like === "true") {
        if (!existingUser) {
          await dbController.createUser(hashedIp, [stock]);
          await dbController.updateStock(stock, ++likes);
        } else if (!existingUser.liked_stocks.includes(stock)) {
          await dbController.updateUser(hashedIp, [
            stock,
            ...existingUser.liked_stocks,
          ]);
          await dbController.updateStock(stock, ++likes);
        }
      } else if (existingUser && existingUser.liked_stocks.includes(stock)) {
        console.log("PLEASE LOG ME", existingUser);
        const indexOfUnlikedStock = existingUser.liked_stocks.indexOf(stock);
        const newLikedStocks = existingUser.liked_stocks.slice();
        newLikedStocks.splice(indexOfUnlikedStock, 1);
        await dbController.updateUser(hashedIp, newLikedStocks);
        await dbController.updateStock(stock, --likes);
      }

      res.status(200).send({
        stockData: {
          stock: stock.toUpperCase(),
          price: stockPriceRes.latestPrice,
          likes: likes,
        },
      });
    } else if (stocks.length === 2) {
      const existingStocks = await Promise.all(
        stocks.map((stock) => {
          dbController.findStock(stock);
        })
      );
      for (let i = 0; i < 2; i++) {
        if (!existingStocks[i]) {
          await dbController.createStock(stocks[i], 0);
          existingStocks[i] = { ticker: stocks[i], likes: 0 };
        }
      }
      let stockPriceApiRes = await Promise.all(
        stocks.map((stock) =>
          axios.get(
            `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
          )
        )
      );
      if (like === "true") {
        console.log("ENTERING LIKE");
        console.log("existing stocks before:", existingStocks);
        for (let i = 0; i < 2; i++) {
          if (
            !existingUser.liked_stocks.includes(existingStocks[i].ticker) ||
            !existingUser
          ) {
            if (!existingUser) {
              await dbController.createUser(hashedIp, [
                existingStocks[i].ticker,
              ]);
              existingUser = {
                hashed_ip_address: hashedIp,
                liked_stocks: [existingStocks[i].ticker],
              };
            } else {
              await dbController.updateUser(hashedIp, [
                ...existingUser.liked_stocks,
                existingStocks[i].ticker,
              ]);
            }
            existingStocks[i].likes = existingStocks[i].likes + 1;
            console.log(existingStocks[i].ticker, existingStocks[i].likes);
            await dbController.updateStock(
              existingStocks[i].ticker,
              existingStocks[i].likes
            );
          }
        }
        console.log("existing stocks after:", existingStocks);
      }
      console.log(existingStocks);
      const formattedResBody = stockPriceApiRes.map((stock, i) => ({
        stock: stocks[i],
        price: stock.data.latestPrice,
        rel_likes: existingStocks[i].likes - existingStocks[(i + 1) % 2].likes,
      }));
      res.status(200).send({ stockData: formattedResBody });
    } else res.send(400);
  });
};
