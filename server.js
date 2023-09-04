import express from "express";
import dotenv from "dotenv";

import cors from "cors";
import connectDB from "./db.js";
import { sendMessage, updateMessageStatus } from "./messageControllers.js";

dotenv.config();


const port = 9000;

const app = express();
app.use(express.json());
connectDB();
app.use(express.json());
app.use(cors());
app.post("/sendmessage", sendMessage)
app.post("/updateStatus",updateMessageStatus)

const server = app.listen(port, () =>
  console.log(`server is running at port ${port}`)
);
