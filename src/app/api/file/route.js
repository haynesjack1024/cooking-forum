import { NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  const MAX_IMG_SIZE_BYTES = 5000000;

  const formData = await req.formData();
  const img = formData.get("image");
  let status = 200;

  if (
    img !== null &&
    new RegExp("^image/.*$").test(img.type) &&
    img.size <= MAX_IMG_SIZE_BYTES
  ) {
    const bytes = await img.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      await writeFile(
        `${process.cwd()}${process.env.IMAGES_DIR}/${uuidv4()}`,
        buffer
      );
    } catch ({ message }) {
      console.error("Error while saving image");
      console.error(message);
      status = 500;
    }
  } else {
    status = 400;
  }

  return new NextResponse({}, { status });
}
