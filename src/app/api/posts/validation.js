import { Types } from "mongoose";

export function validateSinceParam(sinceIdParam) {
  try {
    return sinceIdParam ? new Types.ObjectId(sinceIdParam) : sinceIdParam;
  } catch (e) {
    throw { msg: "The since param is not a valid ObjectId", status: 400 };
  }
}

export function validateLimitParam(limitParam) {
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
