const { StockModel } = require("../models/stock-model");
const dbController = {
  findStock(stock) {
    return StockModel.findOne({ stock });
  },

  createStock(stock, likingIps) {
    return StockModel.create({
      stock,
      likingIps,
    });
  },

  updateStock(stock, likingIps) {
    return StockModel.updateOne({
      stock,
      likingIps,
    });
  },
};

module.exports = {
  dbController,
};
