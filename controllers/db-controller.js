const { StockModel } = require("../models/stock-model");
const { UserModel } = require("../models/user-model");

const dbController = {
  async findUser(hashedIpAddress) {
    return await UserModel.findOne({ hashed_ip_address: hashedIpAddress })
  },

  async createUser(hashedIpAddress, likes) {
    return await UserModel.create({
      hashed_ip_address: hashedIpAddress,
      liked_stocks: likes,
    });
  },

  async updateUser(hashedIpAddress, likes) {
    return await UserModel.updateOne({
      hashed_ip_address: hashedIpAddress,
      liked_stocks: likes,
    });
  },

  async findStock(ticker) {
    return await StockModel.findOne({ ticker });
  },

  async createStock(ticker, likes) {
    return await StockModel.create({
      ticker,
      likes,
    });
  },

  async updateStock(ticker, likes) {
    return await StockModel.updateOne({
      ticker,
      likes,
    });
  },
};

module.exports = {
  dbController,
};
