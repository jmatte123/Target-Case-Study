const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const PriceSchema = new Schema(
  {
    id: Number,
    value: Number,
    currency_code: String
  },
  { timestamps: true },
  { colletion: 'prices' }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Price", PriceSchema);