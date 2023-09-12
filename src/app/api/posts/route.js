import { NextResponse } from "next/server";
import { Post } from "@/mongo/models/Post";
import { Types } from "mongoose";

export async function GET(req) {
  const urlSearchParams = new URL(req.url).searchParams;
  const sinceParam = urlSearchParams.get("since");
  const limitParam = urlSearchParams.get("limit");

  let sinceId, limit;
  try {
    sinceId = validateSinceParam(sinceParam);
    limit = validateLimitParam(limitParam);
  } catch ({ msg, status }) {
    return new NextResponse(msg, { status });
  }

  const filter = sinceId ? { _id: { $gt: sinceId } } : {};
  const queryResult = await Post.find(filter, "author title").limit(limit);

  return NextResponse.json(queryResult, { status: 200 });
}

function validateSinceParam(sinceParam) {
  try {
    return sinceParam ? new Types.ObjectId(sinceParam) : sinceParam;
  } catch (e) {
    throw { msg: "The since param is not a valid ObjectId", status: 400 };
  }
}

function validateLimitParam(limitParam) {
  const MAX_POSTS_PER_PAGE = 50;
  const DEFAULT_LIMIT = 20;

  const limit = parseInt(limitParam ? limitParam : DEFAULT_LIMIT);

  if (isNaN(limit)) {
    throw {
      msg: "The limit parameter is not a number",
      status: 400,
    };
  }

  if (limit < 0 || limit > MAX_POSTS_PER_PAGE) {
    throw {
      msg: `The limit parameter should be between 1 and ${MAX_POSTS_PER_PAGE}`,
      status: 400,
    };
  }

  return limit;
}
