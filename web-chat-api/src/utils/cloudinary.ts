import { UploadApiResponse } from "cloudinary";
import MessageType from "../enums/MessageType.enum.js";
import { FileUpload } from "graphql-upload/processRequest.mjs";
import cloudinary from "../lib/cloudinary.js";

export const uploadMedia = async ({
  file,
  folder,
  filename_override,
  type,
}: {
  file: FileUpload;
  folder: string;
  filename_override?: string;
  type?: MessageType;
}): Promise<UploadApiResponse> => {
  const { createReadStream } = file;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        filename_override: filename_override ?? file.filename,
        resource_type: "video",
      },
      async (error, result) => {
        if (error) reject(error);
        if (result) resolve(result);
      }
    );

    createReadStream().pipe(stream);
  });
};
