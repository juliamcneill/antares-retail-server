const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect("mongodb://mongo:27017/reviews-api", { useNewUrlParser: true })
  .then((error, database) => {
    console.log("Connection to database was successful!");
  })
  .catch((error) => {
    console.log(error);
  });

var Schema = require("./db/schema.js").ReviewsSchema;
var Reviews = mongoose.model("Reviews", Schema, "reviews");

app.get("/", (req, res) => {
  Reviews.find({ id: 1 })
    .then((records) => {
      res.status(200).send(records);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

const port = 3000;
app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
