import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    // Ye todo kis user ka hai. ref: "User" ka matlab User model se link.
    // required: true, taaki bina owner ke koi todo save hi na ho.
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);