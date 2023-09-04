import express from "express";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import twilio from "twilio";
import cors from "cors"
dotenv.config();

const client = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const port = 9000;

const app = express();

app.use(express.json());
app.use(cors());
app.post(
  "/sendmessage",
  asyncHandler(async (req, res) => {
    const { phoneNumber, message } = await req.body;
    
    if (phoneNumber.length === 10 && message) {
      
      await client.messages
        .create({
          from: "whatsapp:+14155238886",
          body: message,
          to: `whatsapp:+91${phoneNumber}`,
        })
        .then((message) =>
          res.status(200).json({
            completed: true,
            info: message,
          })
        );
    } else {
      res.status(400).send("Invalid request check phoneNumber and message");
    }
  })
);

const server = app.listen(port, () =>
  console.log(`server is running at port ${port}`)
);

