import { UploadApiResponse } from "cloudinary";
import MessageType from "../enums/MessageType.enum.js";
import { FileUpload } from "graphql-upload/processRequest.mjs";
import cloudinary from "../lib/cloudinary.js";
import mongoose, { Mongoose } from "mongoose";
import { nanoid } from "zod/v4";
import { ProgressStream } from "progress-stream";

export const uploadMedia = async ({
  file,
  folder,
  filename_override,
  type,
  prog,
  handleUploadDone,
}: {
  file: FileUpload;
  folder: string;
  filename_override?: string;
  type?: MessageType;
  prog: ProgressStream;
  handleUploadDone: Function;
}): Promise<UploadApiResponse> => {
  const { createReadStream } = file;

  return new Promise((resolve, reject) => {
    const cldStream = cloudinary.uploader.upload_stream(
      {
        folder,
        filename_override: filename_override ?? file.filename,
        resource_type: type == MessageType.AUDIO ? "video" : "auto",
      },
      async (error, result) => {
        if (error) reject(error);
        if (result) {
          handleUploadDone();
          resolve(result);
        }
      }
    );

    createReadStream().pipe(prog).pipe(cldStream);
  });
};
