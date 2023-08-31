import { Schema } from "mongoose";
import { authorValidation, sanitizeText } from "./preSave";

export const commentSchema = new Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
      validate: authorValidation,
    },
    content: {
      type: String,
      required: true,
      set: sanitizeText,
      minLength: 15,
      maxLength: 600,
    },
  },
  { timestamps: true }
);
