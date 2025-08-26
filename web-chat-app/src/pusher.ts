import Pusher from "pusher-js";
import { SERVER_URL } from "./apollo";

export const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY!, {
  cluster: import.meta.env.VITE_PUSHER_CLUSTER!,
  // Your GraphQL endpoint should proxy this auth call
  channelAuthorization: {
    endpoint: `${SERVER_URL}/auth/pusher`,
    transport: "ajax",
  },
});
