import Pusher from "pusher-js";

export const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY!, {
  cluster: import.meta.env.VITE_PUSHER_CLUSTER!,
  // Your GraphQL endpoint should proxy this auth call
  // channelAuthorization: { endpoint: "/graphql/pusher-auth", transport: "ajax" },
});
