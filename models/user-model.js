//Require Mongoose
const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  hashed_ip_address: String,
  liked_stocks: [
    {
      type: String,
    },
  ],
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = {
  UserModel,
};
