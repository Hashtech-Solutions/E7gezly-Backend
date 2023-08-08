import {Server} from "socket.io";
import {verifyToken} from "./services/firebaseServices.js";
import User from "./models/User.js";
let ioInstance = null;
const clientsByShopId = {};
const clientsByUserId = {};

export const getIo = (server) => {
  if (!ioInstance) {
    const io = new Server(server, {
      cors: {
        origin: true,
        credentials: true,
      },
    });
    io.use(async (socket, next) => {
      if (socket.handshake.auth && socket.handshake.auth.token) {
        try {
          const decodedToken = await verifyToken(socket.handshake.auth.token);
          const user = await User.findOne({firebaseUID: decodedToken.uid});
          if (!user) {
            throw new Error("Unauthorized");
          }
          socket.request.user = user;
          next();
        } catch (error) {
          io.emit("unauthorized");
        }
      } else {
        io.emit("unauthorized");
      }
    });

    ioInstance = io;
  }
  return ioInstance;
};

export const initConnection = (server) => {
  const io = getIo(server);
  io.on("connect", (socket) => {
    console.log("user connected");
    socket.on("subscribe", () => {
      const shopId = socket.request.user.shopId;
      if (!clientsByShopId[shopId]) {
        clientsByShopId[shopId] = new Set();
      }
      clientsByShopId[shopId].add(socket.id);
    });

    socket.on("subscribeUser", () => {
      const userId = socket.request.user._id;
      if (!clientsByUserId[userId]) {
        clientsByUserId[userId] = new Set();
      }
      clientsByUserId[userId].add(socket.id);
    });

    socket.on("unsubscribe", (shopId) => {
      if (clientsByShopId[shopId]) {
        clientsByShopId[shopId].delete(socket.id);
      }
    });

    socket.on("unsubscribeUser", () => {
      const userId = socket.request.user._id;
      if (clientsByUserId[userId]) {
        clientsByUserId[userId].delete(socket.id);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      Object.values(clientsByShopId).forEach((clients) => {
        clients.delete(socket.id);
      });
    });

    socket.on("disconnectUser", () => {
      const userId = socket.request.user._id;
      Object.values(clientsByUserId).forEach((clients) => {
        clients.delete(socket.id);
      });
    });
  });
};

export const emitEvent = (shopId, event, data) => {
  if (clientsByShopId[shopId] && ioInstance) {
    clientsByShopId[shopId].forEach((clientId) => {
      ioInstance.to(clientId).emit(event, data);
    });
  }
};

export const emitCustomerEvent = (userId, event, data) => {
  if (clientsByUserId[userId] && ioInstance) {
    clientsByUserId[userId].forEach((clientId) => {
      ioInstance.to(clientId).emit(event, data);
    });
  }
};
