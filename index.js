const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect("mongodb://mongo:27017/node", { useNewUrlParser: true })
  .then(() => {
    console.log("Connection to database was successful!");
  })
  .catch((error) => {
    console.log(error);
  });

const Reviews = require("./db/schema.js").Reviews;

app.get("/", (req, res) => {
  Reviews.find()
    .then(() => {
      res.status(200).send("Success");
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

const port = 3000;
app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
