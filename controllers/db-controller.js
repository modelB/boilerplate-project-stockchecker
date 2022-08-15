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
    console.log('STOCK IN UPDATE STOCK:', stock);
    console.log('LIKINGIPS in UPDATE STOCK:', likingIps);
    return StockModel.updateOne({
      stock,
      likingIps,
    });
  },
};

module.exports = {
  dbController,
};
