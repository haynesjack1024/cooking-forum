import { NextResponse } from "next/server";

import { validateLimitParam, validateSinceParam } from "./validation";
import { Post } from "@/mongo/models/Post";

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

  const filter = sinceId ? { _id: { $gte: sinceId } } : {};
  const queryResult = await Post.find(filter, "author title").limit(limit + 1);
  const posts = queryResult.slice(0, -1);
  const nextId = queryResult.at(limit)?._id;

  return NextResponse.json({ posts, nextId }, { status: 200 });
}
