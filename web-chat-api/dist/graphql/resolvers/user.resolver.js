import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import ContactRelationship from "../../enums/ContactRelationship.enum.js";
import User from "../../models/User.model.js";
import userService from "../../services/UserService.js";
import { toObjectId } from "../../utils/mongoose.js";
import { uploadMedia } from "../../utils/cloudinary.js";
export const userResolvers = {
    Upload: GraphQLUpload,
    Query: {
        users: async (_p, { userId }) => {
            const data = await User.find({ _id: toObjectId(userId) });
            return data;
        },
        connectableUsers: async (_p, { userId }) => {
            const data = await userService.getConnectableUsers({ userId });
            return data;
        },
        receivedConnectRequests: async (_p, {}, { user }) => {
            const data = await userService.getUsersByRelationship({
                userId: user.id.toString(),
                relationship: ContactRelationship.requested,
            });
            return data;
        },
        sentConnectRequests: async (_p, {}, { user }) => {
            const data = await userService.getUsersByRelationship({
                userId: user.id.toString(),
                relationship: ContactRelationship.request,
            });
            return data;
        },
    },
    Mutation: {
        uploadUserAvatar: async (_p, { file }, { user }) => {
            const myFile = await file;
            const { secure_url } = await uploadMedia({
                file: myFile,
                folder: `profile/${user.id}`,
            });
            await User.findByIdAndUpdate(user.id, {
                avatar: secure_url,
            });
            return secure_url;
        },
    },
};
