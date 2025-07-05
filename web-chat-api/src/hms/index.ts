import { SDK, Room } from "@100mslive/server-sdk";

const hms = new SDK();

// create a room with options -
let roomWithOptions: Room.Object;

const roomCreateOptions: Room.CreateParams = {};

roomWithOptions = await hms.rooms.create(roomCreateOptions);
