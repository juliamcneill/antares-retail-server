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
var Reviews = mongoose.model("Reviews", ReviewsSchema, "reviews");

var CharacteristicsSchema = require("./db/schemas.js").CharacteristicsSchema;
var Characteristics = mongoose.model(
  "Characteristics",
  CharacteristicsSchema,
  "characteristics"
);

// get list of reviews based on id, sort type, and count
// /reviews/${id}/list?sort=${sortString}:asc&count=${count}
app.get("/reviews/:product_id", (req, res) => {
  Reviews.find({ product_id: req.params.product_id })
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

// // post review with all fields and characteristics
// app.post("/reviews", (req, res) => {
//   Reviews.find({ id: req.query.id })
//     .then((records) => {
//       res.status(200).send(records);
//     })
//     .catch((error) => {
//       res.status(404).send(error);
//     });
// });

// // change report on review
// app.put("/reviews", (req, res) => {
//   Reviews.find({ id: req.query.id })
//     .then((records) => {
//       res.status(200).send(records);
//     })
//     .catch((error) => {
//       res.status(404).send(error);
//     });
// });

// // get list
// app.get("/characteristics", (req, res) => {
//   Characteristics.find({ name: "test" })
//     .then((records) => {
//       res.status(200).send(records);
//     })
//     .catch((error) => {
//       res.status(404).send(error);
//     });
// });

// // post a new review
// app.post("/add", (req, res) => {
//   var maxIndex = Reviews.find({})
//     .sort({ id: -1 })
//     .limit(1)
//     .then((record) => {
//       console.log("record", record[0]);
//       var nextIndex = record[0].id + 1;
//       console.log("nextIndex", nextIndex);
//       var newReview = new Reviews({
//         id: nextIndex,
//         product_id: 1000010,
//         rating: 5,
//         summary: "test",
//         body: "test",
//         recommend: true,
//         reported: false,
//         reviewer_name: "Julia",
//         reviewer_email: "juliammcneill@gmail.com",
//         response: "",
//         helpfulness: 5,
//       });
//       newReview
//         .save()
//         .then(() => {
//           res.status(200).send("Success!");
//         })
//         .catch((error) => {
//           res.status(404).send(error);
//         });
//     });
// });

const port = 3000;
app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
