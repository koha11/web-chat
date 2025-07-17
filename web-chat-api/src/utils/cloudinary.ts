import { FileUpload } from "graphql-upload/processRequest.mjs";
import cloudinary from "lib/cloudinary.js";

export const uploadMedia = async ({
  file,
  folder,
  filename_override,
}: {
  file: FileUpload;
  folder: string;
  filename_override?: string;
}) => {
  const { createReadStream } = file;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, filename_override },
      async (error, result) => {
        if (error) reject(error);
        else {
          const mediaUrl = result!.secure_url;
          resolve(mediaUrl);
        }
      }
    );

    createReadStream().pipe(stream);
  });
};
