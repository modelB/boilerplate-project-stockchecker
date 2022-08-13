"use strict";

const { default: axios } = require("axios");
const { dbController } = require("../controllers/db-controller");

module.exports = function (app) {
  app.route("/api/stock-prices").get(async function (req, res) {
    console.log(ip);
    const { stock, like } = req.query;
    if (stock) {
      const stockPriceRes = (await axios.get(
        `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
      )).data;
      if (like) {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        bcrypt.hash(ip, 13, (err, hash) => {
          console.log(hash);
        });
        const existingUser = dbController.findUser()
      }
      res.status(200).send({stockData: { stock: stock.toUpperCase(), price: stockPriceRes.latestPrice, likes: 0 }});
    } else res.send(400);
  });
};
