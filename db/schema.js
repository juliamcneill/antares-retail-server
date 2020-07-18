const mongoose = require("mongoose");

const ReviewsSchema = new mongoose.Schema(
  {
    product_id: {
      type: Number,
      required: true,
    },
    rating: Number,
    date: Date,
    summary: String,
    body: String,
    recommend: String,
    reported: String,
    reviewer_name: String,
    reviewer_email: String,
    response: String,
    helpfulness: Number,
  },
  {
    timestamps: true,
  }
);

const Reviews = mongoose.model("Reviews", ReviewsSchema);

module.exports = { Reviews };
