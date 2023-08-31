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
    return NextResponse.json({ msg: message }, { status: 400 });
  }

  if (formData.get("img") !== null) {
    try {
      const imgData = await imgValidation(formData.get("img"));
      const img = await saveImg(imgData);
      post.img = img;
    } catch ({ msg, status }) {
      return NextResponse.json({ msg }, { status });
    }
  }

  try {
    await post.save();
  } catch (e) {
    return NextResponse.json({
      msg: "Error while saving post",
      status: 500,
    });
  }

  return NextResponse.json(
    { msg: "The post was saved successfully" },
    { status: 200 }
  );
}
