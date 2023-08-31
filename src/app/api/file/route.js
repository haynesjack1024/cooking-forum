import { NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import imageType from "image-type";

export async function POST(req) {
  const MAX_IMG_SIZE_BYTES = 5000000;
  const FILETYPE_REGEX = /^image\/(jpeg|png|webp|gif)$/;
  const POINTER_FILE = './images/pointer.bin';

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

  const imgBytes = await img.arrayBuffer();
  const imgBuffer = Buffer.from(imgBytes);
  const imgType = await imageType(imgBuffer);

  if (imgType === undefined || !FILETYPE_REGEX.test(imgType.mime)) {
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

    await writeFile(path + "/" + pointer + "." + imgType.ext, imgBuffer);

    const pointerBuffer = Buffer.alloc(4);
    pointerBuffer.writeUInt32BE(parseInt(pointer));
    await writeFile(
      POINTER_FILE,
      pointerBuffer
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
