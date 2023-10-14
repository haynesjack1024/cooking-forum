import { writeFile, readFile, mkdir } from "node:fs/promises";
import imageType from "image-type";

export async function saveImg(imgData) {
  const POINTER_FILE = `.${process.env.IMAGES_DIR}/pointer.bin`;

  try {
    let pointerInt;
    try {
      pointerInt = (await readFile(POINTER_FILE)).readUInt32BE() + 1
    } catch(e) {
      pointerInt = 1;
    }
    const pointer = String(pointer).padStart(12, "0");

    let path = process.cwd() + process.env.IMAGES_DIR;
    for (let i = 0; i < 3; i++) {
      path += "/" + pointer.slice(i * 3, (i + 1) * 3);
    }

    await mkdir(path, { recursive: true });
    await writeFile(path + "/" + pointer + "." + imgData.type.ext, imgData.buf);

    const pointerBuffer = Buffer.alloc(4);
    pointerBuffer.writeUInt32BE(parseInt(pointer));
    await writeFile(POINTER_FILE, pointerBuffer);

    return pointer;
  } catch ({ message }) {
    console.error(message);
    throw {
      msg: "An error occured while saving the post's image",
      status: 500,
    };
  }
}

export async function imgValidation(imgFile) {
  const MAX_IMG_SIZE_BYTES = 5000000;
  const IMG_TYPE_REGEX = /^image\/(jpeg|png|webp|gif)$/;

  if (Object.prototype.toString.call(imgFile) !== "[object File]") {
    throw {
      msg: "The img field is not a File object",
      status: 400,
    };
  }

  if (imgFile.size > MAX_IMG_SIZE_BYTES) {
    throw {
      msg: `The img File is too large, it should be less or equal to ${
        MAX_IMG_SIZE_BYTES / 1000000
      } MB`,
      status: 413,
    };
  }

  const imgBuffer = Buffer.from(await imgFile.arrayBuffer());
  const imgType = await imageType(imgBuffer);

  if (imgType === undefined || !IMG_TYPE_REGEX.test(imgType.mime)) {
    throw {
      msg: "The uploaded file's type is not supported, \
          please send a file belonging to one of the \
          following MIME types: image/jpeg, image/png, \
          image/gif or image/webp",
      status: 415,
    };
  }

  return {
    buf: imgBuffer,
    type: imgType,
  };
}
