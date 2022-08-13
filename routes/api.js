"use strict";

const { default: axios } = require("axios");

module.exports = function (app) {
  app.route("/api/stock-prices").get(async function (req, res) {
    const { stock, like } = req.query;
    if (stock) {
      const stockPriceRes = (await axios.get(
        `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
      )).data;
      console.log(stockPriceRes);
      res.status(200).send({stockData: { stock: stock.toUpperCase(), price: stockPriceRes.latestPrice, likes: 0 }});
    } else res.send(400);
  });
};
