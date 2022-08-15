//Require Mongoose
const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;

const StockSchema = new Schema({
  stock: String,
  likingIps: [{ type: String }],
});

const StockModel = mongoose.model("stock", StockSchema);

module.exports = {
  StockModel,
};
