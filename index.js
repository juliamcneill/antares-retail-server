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
    .then((records) => {
      res.status(200).send(records);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

app.post("/reviews/:product_id", (req, res) => {
  Review.find({})
    .sort({ id: -1 })
    .limit(1)
    .then((x) => {
      var newReview = new Review({
        id: x[0].id + 1,
        product_id: req.params.product_id,
        rating: req.body.rating,
        summary: req.body.summary,
        body: req.body.body,
        recommend: req.body.recommend,
        reported: false,
        reviewer_name: req.body.name,
        reviewer_email: req.body.email,
        response: "",
        helpfulness: 0,
      });
      newReview.save().catch((error) => {
        res.status(404).send(error);
      });
      ReviewPhoto.find({})
        .sort({ id: -1 })
        .limit(1)
        .then((y) => {
          let index = y[0].id + 1;
          for (var photo in req.body.photos) {
            let newCharacteristicReview = new CharacteristicReview({
              id: index++,
              review_id: record[0].id + 1,
              url: photo,
            });
            newCharacteristicReview.save().catch((error) => {
              res.status(404).send(error);
            });
          }
        })
        .catch((error) => {
          res.status(404).send(error);
        });
      CharacteristicReview.find({})
        .sort({ id: -1 })
        .limit(1)
        .then((z) => {
          let index = z[0].id + 1;
          for (var characteristic in req.body.characteristics) {
            let newCharacteristicReview = new CharacteristicReview({
              id: index++,
              review_id: record[0].id + 1,
              characteristics_id: parseInt(characteristic),
              value: characteristics[characteristic],
            });
            newCharacteristicReview.save().catch((error) => {
              res.status(404).send(error);
            });
          }
        });
    })
    .then(() => {
      res.status(200).send("Success!");
    });
});

const port = 3000;
app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
