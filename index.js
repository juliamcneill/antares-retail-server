const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + "/../client/dist"));

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

app.get("/reviews/:product_id/list", (req, res) => {
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
      res.status(200).send({
        product: req.params.product_id,
        count: req.query.count,
        results: records,
      });
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

app.get("/reviews/:product_id/meta", (req, res) => {
  Characteristic.find({
    product_id: req.params.product_id,
  }).then((characteristics) => {
    let characteristicsTracker = {};
    for (let i = 0; i < characteristics.length; i++) {
      let total = 0;
      let count = 0;
      CharacteristicReview.find({
        characteristic_id: characteristics[i].id,
        product_id: characteristics[i].product_id,
      })
        .then((matches) => {
          for (let match of matches) {
            total += match.value;
            count++;
          }
        })
        .then(() => {
          characteristicsTracker[characteristics[i].name] = {
            id: characteristics[i].name,
            value: total / count,
          };
          if (
            Object.keys(characteristicsTracker).length ===
            characteristics.length
          ) {
            Review.find({ product_id: req.params.product_id })
              .lean()
              .then((records) => {
                let ratingsTracker = {};
                let recsTracker = { "0": 0, "1": 0 };
                for (let record of records) {
                  ratingsTracker[record.rating]
                    ? ratingsTracker[record.rating]++
                    : (ratingsTracker[record.rating] = 1);
                  record.recommend === 0 ||
                  record.recommend === "false" ||
                  record.recommend == undefined
                    ? recsTracker["0"]++
                    : recsTracker["1"]++;
                }
                res.status(200).json({
                  product_id: req.params.product_id,
                  ratings: ratingsTracker,
                  recommended: recsTracker,
                  characteristics: characteristicsTracker,
                });
              })
              .catch((error) => {
                res.status(404).send(error);
              });
          }
        })
        .catch((error) => {
          res.status(404).send(error);
        });
    }
  });
});

app.post("/reviews/:product_id", (req, res) => {
  let newReview = new Review({
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
  newReview
    .save()
    .then(() => {
      Review.find()
        .sort({ $natural: -1 })
        .limit(1)
        .then((currentReview) => {
          for (let characteristic in req.body.characteristics) {
            let newCharacteristicReview = new CharacteristicReview({
              review_id: currentReview[0]._id,
              characteristic_id: parseInt(characteristic),
              value: req.body.characteristics[characteristic],
            });
            newCharacteristicReview.save().catch((error) => {
              res.status(404).send(error);
            });
          }
          return currentReview;
        })
        .then((currentReview) => {
          for (let photo of req.body.photos) {
            let newReviewPhoto = new ReviewPhoto({
              review_id: currentReview[0]._id,
              url: photo,
            });
            newReviewPhoto.save().catch((error) => {
              res.status(404).send(error);
            });
          }
        })
        .then(() => {
          res.status(200).send("Success!");
        })
        .catch((error) => {
          res.status(404).send(error);
        });
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

// ? script to delete duplicates based on old id
// app.get("/clean", (req, res) => {
//   CharacteristicReview.ensureIndex(
//     { _id_old: 1 },
//     { unique: true, dropDups: true }
//   )
//     .then(() => {
//       res.status(200).send("Success!");
//     })
//     .catch((error) => {
//       res.status(404).send(error);
//     });
// });

// ? script to rename collection field names
// app.get("/rename", (req, res) => {
//   CharacteristicReview.updateMany(
//     {},
//     {
//       $rename: {
//         _id_x: "review_id",
//         id_y: "_id_old",
//         review_id: "review_id_old",
//       },
//     }
//   )
//     .then(() => {
//       res.status(200).send("Success!");
//     })
//     .catch((error) => {
//       res.status(404).send(error);
//     });
// });

// ? script to assign mongo id as foreign key based on sql id
// ? works on only 30,000 records at a time; used pandas instead
// app.get("/reviewsparser", (req, res) => {
//   for (let i = req.query.start; i <= req.query.end; i++) {
//     Review.find({ id: i })
//       .lean()
//       .then((records) => {
//         CharacteristicReview.updateMany(
//           { review_id: records[0].id },
//           { $set: { review_mongoid: records[0]._id } }
//         )
//           .then(() => {
//             console.log(
//               "successfully replaced " +
//                 records[0].id +
//                 " with " +
//                 records[0]._id +
//                 " for record " +
//                 i
//             );
//           })
//           .catch((error) => {
//             res.status(404).send(error);
//           });
//       })
//       .catch((error) => {
//         res.status(404).send(error);
//       });
//   }
//   res
//     .status(200)
//     .send("Success for " + req.query.start + " through " + req.query.end + "!");
// });

const port = 3000;
app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
