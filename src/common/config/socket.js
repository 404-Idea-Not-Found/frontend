import { io } from "socket.io-client";

async function connectSocket(room, isOwner, userId) {
  const socket = io(
    `${process.env.REACT_APP_SERVER_URL}?room=${room}&isOwner=${isOwner}&userId=${userId}`
  );

  return new Promise((resolve, reject) => {
    socket.on("connect", () => {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log("socket: ", socket.id, "connected");
      }
      resolve(socket);
    });
    socket.on("connect_error", (error) => {
      reject(new Error(error.data));
    });
    socket.on("disconnect", () => {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log("socket: ", socket.id, "disconnected!");
      }
    });
  });
}

export default connectSocket;
