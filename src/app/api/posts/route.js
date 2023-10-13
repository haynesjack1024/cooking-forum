import { NextResponse } from "next/server";

import { validateLimitParam, validateSinceParam } from "./validation";
import { Post } from "@/mongo/models/Post";
import { Types } from "mongoose";

export async function GET(req) {
  const urlSearchParams = new URL(req.url).searchParams;
  const sinceIdParam = urlSearchParams.get("since_id");
  const limitParam = urlSearchParams.get("limit");

  let sinceId, limit;
  try {
    sinceId = validateSinceParam(sinceIdParam);
    limit = validateLimitParam(limitParam);
  } catch ({ msg, status }) {
    return new NextResponse(msg, { status });
  }

  const filter = { _id: { $gte: sinceId ?? new Types.ObjectId(0) } };
  const queryResult = await Post.find(filter, "author title").limit(limit + 1);
  const posts = queryResult.slice(0, -1);
  const nextId = queryResult.at(limit)?._id;

  return NextResponse.json({ posts, nextId }, { status: 200 });
}
