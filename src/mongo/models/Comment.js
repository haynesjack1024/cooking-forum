import mongoose from "../db";
import { commentSchema } from "../schemas/post/commentSchema";

export const Comment =
  mongoose.models?.Comment || new mongoose.model("Comment", commentSchema);
