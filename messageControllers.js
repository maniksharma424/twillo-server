import asyncHandler from "express-async-handler";
import Message from "./messageModel.js";
import twilio from "twilio";
import { configDotenv } from "dotenv";

configDotenv();

const client = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

export const sendMessage = asyncHandler(async (req, res) => {
  const { phoneNumber, message } = await req.body;

  if (phoneNumber.length === 10 && message) {
    const response = await client.messages.create({
      from: "whatsapp:+14155238886",
      body: message,
      statusCallback: "https://twillo-server.onrender.com/updateStatus",
      to: `whatsapp:+91${phoneNumber}`,
    });

    const newMessage = await Message.create({
      completed: true,
      sid: response.sid,
      status: response.status,
    });
    newMessage.save();
    if (newMessage) {
      res.status(200).json({
        completed: true,
        info: response,
      });
    }
  } else {
    res.status(400).send("Invalid request check phoneNumber and message");
  }
});

export const updateMessageStatus = asyncHandler(async (req, res) => {
  console.log("hi updation Started");
  console.log(req.body);
  const { MessageSid, MessageStatus } = await req.body;
  console.log(MessageSid);
  if (MessageSid && MessageStatus) {
    const message = await Message.findOne({ sid: MessageSid });
    console.log(message);
    message.sid = MessageSid;
    const updatedMessage = message.save();
    console.log(updatedMessage);
    res.status(200);
  }
});
