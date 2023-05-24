import app from "./index.js";
import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);
// should be changed in production
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

const clientsByShopId = {};

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("subscribe", (shopId) => {
    if (!clientsByShopId[shopId]) {
      clientsByShopId[shopId] = new Set();
    }
    clientsByShopId[shopId].add(socket.id);
    console.log(clientsByShopId);
  });

  socket.on("unsubscribe", (shopId) => {
    if (clientsByShopId[shopId]) {
      clientsByShopId[shopId].delete(socket.id);
    }
  });

  socket.on("disconnect", () => {
    // remove socket from clientsByShopId
    for (const shopId in clientsByShopId) {
      clientsByShopId[shopId].delete(socket.id);
    }
  });
});
