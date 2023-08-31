import imageType from "image-type";
import escape from "validator/lib/escape";
import stripLow from "validator/lib/stripLow";

export default async function formValidation(formData) {
  const missingFieldMsg = areFieldsMissing(formData, [
    "author",
    "title",
    "img",
    "content",
  ]);
  if (missingFieldMsg) {
    return { msg: missingFieldMsg, status: 400 };
  }

  return {
    img: await imgValidation(formData.get("img")),
    author: authorValidation(formData.get("author")),
    title: textValidation(formData.get("title"), "title", 50),
    content: textValidation(formData.get("content"), "content", 500),
  };
}

function areFieldsMissing(formData, fieldNames) {
  return fieldNames.reduce(
    (acc, name) =>
      (formData.get(name) === null
        ? `Field \"${name}\" is missing from the JSON object`
        : false) || acc,
    false
  );
}

async function imgValidation(img) {
  const MAX_IMG_SIZE_BYTES = 5000000;
  const IMG_TYPE_REGEX = /^image\/(jpeg|png|webp|gif)$/;

  if (Object.prototype.toString.call(img) !== "[object File]") {
    throw {
      msg: "The img field is not a File object",
      status: 400,
    };
  }

  if (img.size > MAX_IMG_SIZE_BYTES) {
    throw {
      msg: `The img File is too large, it should be less or equal to ${
        MAX_IMG_SIZE_BYTES / 1000000
      } MB`,
      status: 413,
    };
  }

  const imgBuffer = Buffer.from(await img.arrayBuffer());
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

function authorValidation(author) {
  const AUTHOR_REGEX = /^[a-zA-Z0-9]{3,20}$/;
  const authorTrimmed = author.trim();

  if (!AUTHOR_REGEX.test(authorTrimmed)) {
    throw {
      msg: `The post's author username should be between 3 and 20 alphanumeric characters`,
      status: 400,
    };
  }

  return authorTrimmed;
}

function textValidation(text, fieldName, maxLen) {
  const sanitized = stripLow(escape(text.trim()), true);

  if (sanitized.length > maxLen) {
    throw {
      msg: `The post's ${fieldName} is longer than ${maxLen} permitted characters`,
      status: 400,
    };
  }

  return sanitized;
}
