import { Schema } from "mongoose";
import { authorValidation, sanitizeText } from "./preSave";
import { commentSchema } from "./commentSchema";

export const postSchema = new Schema(
  {
    img: { type: String, trim: true, maxLength: 12 },
    author: {
      type: String,
      required: true,
      trim: true,
      validate: authorValidation,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      set: sanitizeText,
      minLength: 3,
      maxLength: 100,
    },
    content: {
      type: String,
      required: true,
      set: sanitizeText,
      minLength: 15,
      maxLength: 1500,
    },
    comments: [commentSchema],
  },
  { timestamps: true }
);
