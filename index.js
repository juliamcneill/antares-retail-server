const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { getMaxListeners } = require("process");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect("mongodb://mongo:27017/reviews-api", { useNewUrlParser: true })
  .then(() => {
    console.log("Connection to database was successful!");
  })
  .catch((error) => {
    console.log(error);
  });

var ReviewsSchema = require("./db/schemas.js").ReviewsSchema;
var Review = mongoose.model("Review", ReviewsSchema, "reviews");

var CharacteristicsSchema = require("./db/schemas.js").CharacteristicsSchema;
var Characteristic = mongoose.model(
  "Characteristic",
  CharacteristicsSchema,
  "characteristics"
);

var CharacteristicsReviewsSchema = require("./db/schemas.js")
  .CharacteristicsReviewsSchema;
var CharacteristicReview = mongoose.model(
  "CharacteristicReview",
  CharacteristicsReviewsSchema,
  "characteristics_reviews"
);

var ReviewsPhotosSchema = require("./db/schemas.js").ReviewsPhotosSchema;
var ReviewPhoto = mongoose.model(
  "ReviewPhoto",
  ReviewsPhotosSchema,
  "reviews_photos"
);

// get list of reviews based on id, sort type, and count
// /reviews/${id}/list?sort=${sortString}:asc&count=${count}
app.get("/reviews/:product_id", (req, res) => {
  Review.find({ product_id: req.params.product_id })
    .sort(
      req.query.sort === "newest"
        ? { createdAt: -1 }
        : req.query.sort === "helpful"
        ? { helpfulness: 1 }
        : { helpfulness: 1, createdAt: -1 }
    )
    .limit(parseInt(req.query.count))
    .lean()
    .then((records) => {
      res.status(200).send(records);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

const port = 3000;
app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
