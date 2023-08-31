"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

export default function App() {
  const MAX_IMG_SIZE_BYTES = 5000000;
  const FILETYPE_REGEX = /^image\/(jpeg|png|webp|gif)$/;
  const [status, setStatus] = useState();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted, isSubmitting, isSubmitSuccessful },
  } = useForm();

  async function onSubmit(data) {
    const formData = new FormData();
    formData.append("image", data.image[0]);

    const res = await fetch("/api/file", {
      method: "POST",
      body: formData,
    });

    setStatus(res.ok);
  }

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="file"
        {...register("image", {
          required: "You haven't picked an image",
          onChange: () => setStatus(undefined),
          validate: {
            type: (v) =>
              FILETYPE_REGEX.test(v[0].type) ||
              "The picked file type is not a supported, choose gif, jpeg, png or webp",
            size: (v) =>
              v[0].size <= MAX_IMG_SIZE_BYTES ||
              `Image's size should be less or equal to ${
                MAX_IMG_SIZE_BYTES / 1000000
              } MB`,
          },
        })}
      />
      <div>
        {errors.image?.message ||
          (() => {
            if (status === undefined) {
              if (isSubmitting) {
                return "sending...";
              } else if (isSubmitted) {
                return isSubmitSuccessful
                  ? "waiting for response..."
                  : "sending failed";
              }
            } else {
              return status
                ? "file uploaded successfully!"
                : "file upload failed";
            }
          })()}
      </div>
      <input type="submit" value="upload" />
    </form>
  );
}
