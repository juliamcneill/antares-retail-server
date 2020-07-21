const mongoose = require("mongoose");

const ReviewsSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    product_id: {
      type: Number,
      required: true,
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
  },
  product_id: {
    type: Number,
    required: true,
  },
  name: String,
});

const CharacteristicsReviewsSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  characteristic_id: {
    type: Number,
    required: true,
  },
  review_id: {
    type: Number,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const ReviewsPhotosSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  review_id: {
    type: Number,
    required: true,
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
