import express from "express";
import router from "./router";
import db from "./config/db";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec, { swaggerUiOptions } from "./config/swagger";

export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    // console.log(colors.bgGreen.bold(" Connectiom successfully to DB "));
  } catch (error) {
    // console.log(error);
    console.log(colors.bgRed.white("There was an error on DB"));
  }
}

connectDB();

const server = express();

// const corsOptions: CorsOptions = {
//   origin: function (origin, callback) {
//     if (origin === process.env.FRONTEND_URL) {
//       callback(null, true);
//     } else {
//       callback(new Error("CORS Error"));
//     }
//   },
// };

server.use(cors());

server.use(express.json());

//Routing
server.use(morgan("dev"));
server.use("/api/products", router);

server.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

export default server;
