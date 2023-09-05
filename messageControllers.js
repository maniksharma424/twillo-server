import asyncHandler from "express-async-handler";
import Message from "./messageModel.js";
import twilio from "twilio";
import { configDotenv } from "dotenv";

configDotenv();

const client = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

//Send Text Message
export const sendMessage = asyncHandler(async (req, res) => {
  const {phoneNumber,message,name} = await req.body;

  if (phoneNumber.length === 10 && message) {
    const response = await client.messages.create({
      from: "whatsapp:+14155238886",
      body: `Hi ${name} ${message}`,
      statusCallback: "https://twillo-server.onrender.com/updateStatus",
      to: `whatsapp:+91${phoneNumber}`,
    });

    const newMessage = await Message.create({
      completed: true,
      sid: response.sid,
      status: response.status,
      from: response.from,
      to: response.to,
      body: response.body,
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

//Send Media Message
export const sendMediaMessage = asyncHandler(async (req, res) => {
  const { phoneNumber, video_URL } = await req.body;

  if (phoneNumber.length === 10 && video_URL) {
    const response = await client.messages.create({
      mediaUrl: [`${video_URL}`],
      from: "whatsapp:+14155238886",
      to: `whatsapp:+91${phoneNumber}`,
      body:video_URL,
    });
    const newMessage = await Message.create({
      completed: true,
      sid: response.sid,
      status: response.status,
      from: response.from,
      body:response.body,
      to: response.to,
      VideoUrl: video_URL,
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
  const { MessageSid, MessageStatus } = await req.body;

  if (MessageSid && MessageStatus) {
    console.log(MessageStatus);
    const message = await Message.findOne({ sid: MessageSid });
    message.status = await MessageStatus;
    const updatedMessage = await message.save();

    res.status(200);
  }
});

export const getAllMessages = asyncHandler(async (req, res) => {
  const allMessages = await Message.find({});
  if (allMessages) {
    res.status(200).json({
      messages: allMessages,
    });
  } else {
    res.status(400).send("Smomething went wrong");
  }
});
