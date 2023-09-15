import { NextResponse } from "next/server";
import { imgValidation, saveImg } from "@/imgUpload.js";

import { Post } from "@/mongo/models/Post";

export async function POST(req) {
  const formData = await req.formData();

  const post = new Post({
    author: formData.get("author"),
    title: formData.get("title"),
    content: formData.get("content"),
  });

  try {
    await post.validate();
  } catch ({ message }) {
    return new NextResponse(message, { status: 400 });
  }

  if (formData.get("img") !== null) {
    try {
      const imgData = await imgValidation(formData.get("img"));
      const img = await saveImg(imgData);
      post.img = img;
    } catch ({ msg, status }) {
      return new NextResponse(msg, { status });
    }
  }

  try {
    await post.save();
  } catch ({ message }) {
    console.error(message);
    return new NextResponse("Error while saving post", { status: 500 });
  }

  return new NextResponse("The post was uploaded successfully", {
    status: 201,
  });
}
