import { StockModel } from "../models/stock-model";
import { UserModel } from "../models/user-model";

export const dbController = {
  async findUser(hashedIpAddress) {
    return await UserModel.find({ hashed_ip_address: hashedIpAddress });
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
    return await StockModel.find({ ticker });
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
