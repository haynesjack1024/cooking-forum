import mongoose from "../db";

export const Post =
  mongoose.models?.Post ||
  new mongoose.model(
    "Post",
    new mongoose.Schema({
      author: String,
      title: String,
      img: String,
      content: String,
    })
  );
