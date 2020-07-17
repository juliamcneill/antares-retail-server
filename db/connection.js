const mongoose = require("mongoose");

mongoose.connect("mongodb://mongodb/reviews-api", { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected!");
});

module.exports = db;
