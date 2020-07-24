const mongoose = require("mongoose");

const ReviewsSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      index: true,
    },
    product_id: {
      type: Number,
      required: true,
      index: true,
    },
    rating: Number,
    createdAt: Date,
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

const CharacteristicsSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    index: true,
  },
  product_id: {
    type: Number,
    required: true,
  },
  name: String,
});

const CharacteristicsReviewsSchema = new mongoose.Schema({
  review_id: {
    type: String,
    required: true,
  },
  old_id: {
    type: Number,
  },
  characteristic_id: {
    type: Number,
    required: true,
  },
  old_review_id: {
    type: Number,
  },
  value: {
    type: Number,
    required: true,
  },
});

const ReviewsPhotosSchema = new mongoose.Schema({
  review_id: {
    type: String,
    required: true,
  },
  _id_old: {
    type: Number,
  },
  review_id_old: {
    type: Number,
  },
  url: {
    type: String,
    required: true,
  },
});

module.exports = {
  ReviewsSchema,
  CharacteristicsSchema,
  CharacteristicsReviewsSchema,
  ReviewsPhotosSchema,
};
