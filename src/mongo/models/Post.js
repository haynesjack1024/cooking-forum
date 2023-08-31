import mongoose from "../db";
import { postSchema } from "../schemas/post/postSchema";

export const Post =
  mongoose.models?.Post || new mongoose.model("Post", postSchema);
