import cloudinary from "lib/cloudinary.js";
export const uploadMedia = async ({ file, folder, filename_override, type, }) => {
    const { createReadStream } = file;
    // const resource_type =
    //   type == MessageType.IMAGE
    //     ? "image"
    //     : type == MessageType.VIDEO
    //     ? "video"
    //     : "raw";
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder,
            filename_override: filename_override ?? file.filename,
            resource_type: "auto",
        }, async (error, result) => {
            if (error)
                reject(error);
            if (result)
                resolve(result);
        });
        createReadStream().pipe(stream);
    });
};
