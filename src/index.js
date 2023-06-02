import express from "express";
import { createServer } from "http";
import sessionMiddleware from "./config/sessionMiddleware.js";
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
// import router from "./routes/index.js";
import session from "express-session";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { initConnection } from "./socket.js";

dotenv.config();

const app = express();
const server = createServer(app);
app.set("trust proxy", 1);
app.use(express.json());
// should be changed in production
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(sessionMiddleware);

connectDB();
app.use(passport.initialize());
app.use(passport.session());

const options = {
  definition: {
    version: "2.0",
    openapi: "3.0.1",
    info: {
      title: "Express API for E7gezly Backend",
      description: "Kosom eldocumentation 3la kosom ra2fat 3shan ma3mlosh",
    },
    servers: [
      {
        url: `${process.env.DOMAIN}`,
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

if (process.env.NODE_ENV !== "production") {
  try {
    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(specs, { explorer: true })
    );
  } catch (err) {
    console.log(err);
  }
}

// app.use("/api", router);
app.use(errorHandler);

initConnection(server);

server.listen(3000, () => console.log("Server running on port 3000"));

export default app;
