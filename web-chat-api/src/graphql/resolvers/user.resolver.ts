import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import ContactRelationship from "../../enums/ContactRelationship.enum.js";
import IMyContext from "../../interfaces/socket/myContext.interface.js";
import User from "../../models/User.model.js";
import userService from "../../services/UserService.js";
import { IResolvers } from "@graphql-tools/utils";
import cloudinary from "lib/cloudinary.js";
import { toObjectId } from "utils/mongoose.js";

export const userResolvers: IResolvers = {
  Upload: GraphQLUpload,
  Query: {
    users: async (_p: any, { userId }) => {
      const data = await User.find({ _id: toObjectId(userId) });

      return data;
    },
    connectableUsers: async (_p: any, { userId }) => {
      const data = await userService.getConnectableUsers({ userId });

      return data;
    },
    receivedConnectRequests: async (_p: any, {}, { user }: IMyContext) => {
      const data = await userService.getUsersByRelationship({
        userId: user.id.toString(),
        relationship: ContactRelationship.requested,
      });

      return data;
    },
    sentConnectRequests: async (_p: any, {}, { user }) => {
      const data = await userService.getUsersByRelationship({
        userId: user.id.toString(),
        relationship: ContactRelationship.request,
      });

      return data;
    },
  },
  Mutation: {
    uploadUserAvatar: async (_p: any, { file }, { user }: IMyContext) => {
      const { createReadStream } = await file;

      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "uploads" },
          async (error, result) => {
            if (error) reject(error);
            else {
              const image_url = result!.secure_url;
              const updatedUser = await User.findByIdAndUpdate(user.id, {
                avatar: image_url,
              });
              resolve(image_url);
            }
          }
        );
        createReadStream().pipe(stream);
      });
    },
  },
};
