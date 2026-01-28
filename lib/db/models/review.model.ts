import { IReviewInput } from "@/types";
import { Document, model, models, Model, Schema, Types } from "mongoose";

export interface IReview extends Document, IReviewInput {
  //   _id: string;
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  product: {
    type: Schema.Types.ObjectId as unknown as typeof String,
    ref: "Product",
  },
  user: {
    type: Schema.Types.ObjectId as unknown as typeof String,
    ref: "User",
  },
  isVerifiedPurchase: {
    type: Boolean,
    required: true,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

const Review =
  (models.Review as Model<IReview>) || model<IReview>("Review", reviewSchema);

export default Review;
