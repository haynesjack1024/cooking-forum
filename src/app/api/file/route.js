import { NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

import formValidation from "./validation";
import { Post } from "@/mongo/models/Post";

export async function POST(req) {
  const formData = await req.formData();

  try {
    await savePost(await formValidation(formData));
  } catch ({ msg, status }) {
    return NextResponse.json({ msg }, { status });
  }

  return NextResponse.json(
    { msg: "The image was uploaded successfully" },
    { status: 200 }
  );
}

async function savePost(post) {
  const POINTER_FILE = "./images/pointer.bin";

  try {
    const pointer = String(
      (await readFile(POINTER_FILE)).readUInt32BE() + 1
    ).padStart(12, "0");

    let path = process.cwd() + process.env.IMAGES_DIR;
    for (let i = 0; i < 3; i++) {
      path += "/" + pointer.slice(i * 3, (i + 1) * 3);
    }

    if (!existsSync(path)) {
      await mkdir(path, { recursive: true });
    }

    await writeFile(
      path + "/" + pointer + "." + post.img.type.ext,
      post.img.buf
    );

    await new Post({
      author: post.author,
      title: post.title,
      img: pointer,
      content: post.content,
    }).save();

    const pointerBuffer = Buffer.alloc(4);
    pointerBuffer.writeUInt32BE(parseInt(pointer));
    await writeFile(POINTER_FILE, pointerBuffer);
  } catch ({ message }) {
    console.error(message);
    throw { msg: "An error occured while saving the post", status: 500 };
  }
}
