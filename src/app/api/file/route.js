import { NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";
import imageType from "image-type";

export async function POST(req) {
  const MAX_IMG_SIZE_BYTES = 5000000;
  const FILETYPE_REGEX = /^image\/(jpeg|png|webp|gif)$/;

  const img = (await req.formData()).get("image");
  if (img === null) {
    return NextResponse.json(
      { msg: "The formData is missing an image field" },
      { status: 400 }
    );
  }

  if (img.size > MAX_IMG_SIZE_BYTES) {
    return NextResponse.json(
      {
        msg: `The file is too large, it should be less or equal to ${
          MAX_IMG_SIZE_BYTES / 1000000
        } MB`,
      },
      { status: 413 }
    );
  }

  const bytes = await img.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const type = await imageType(buffer);

  if (type === undefined || !FILETYPE_REGEX.test(type.mime)) {
    return NextResponse.json(
      {
        msg: "The uploaded file's type is not supported, \
          please send a file belonging to one of the \
          following MIME types: image/jpeg, image/png, \
          image/gif or image/webp",
      },
      { status: 415 }
    );
  }

  try {
    await writeFile(
      `${process.cwd()}${process.env.IMAGES_DIR}/${uuidv4()}.${type.ext}`,
      buffer
    );
  } catch ({ message }) {
    console.error(message);
    return NextResponse.json(
      { msg: "An error occured while saving the image" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { msg: "The image was uploaded successfully" },
    { status: 200 }
  );
}
