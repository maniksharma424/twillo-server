import asyncHandler from "express-async-handler";
import Message from "./messageModel.js";
import twilio from "twilio";
import { configDotenv } from "dotenv";

configDotenv();

const client = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

//Send Text Message POST

export const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { sender,senderNumber, message, video_URL, recipients } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length <= 0) {
      return res.status(400).send("Invalid request: No recipients found");
    }

    const promises = [];

    for (const recipient of recipients) {
      const response = await client.messages.create({
        from: "whatsapp:+14155238886",
        body: `Hi ${recipient?.name} ${message} -${sender}`,
        statusCallback: "https://twillo-server.onrender.com/updateStatus",
        to: `whatsapp:+91${recipient?.phoneNumber}`,
      });

      const mediaResponse = await client.messages.create({
        mediaUrl: [`${video_URL}`],
        from: "whatsapp:+14155238886",
        to: `whatsapp:+91${recipient?.phoneNumber}`,
        body: video_URL,
      });


      const newMessage = await Message.create({
        sid: response.sid,
        sender: sender,
        receiver: recipient.name,
        from: response.from,
        receiverNumber: response.to,
        body: response.body,
        videoUrl: video_URL,
        status: response.status,
        senderNumber:senderNumber
      });
      await newMessage.save();

      promises.push({
        recipient: recipient.name,
        messageResponse: response,
        videoResponse:mediaResponse
      });
    }

    const results = await Promise.all(promises)

    res.status(200).json({
      info: results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while sending messages.",
    });
  }
});

//POST ("/updateStatus") update message status


export const updateMessageStatus = asyncHandler(async (req, res) => {
  try {
    const { MessageSid, MessageStatus } = req.body;

    if (MessageSid && MessageStatus) {
      const message = await Message.findOne({ sid: MessageSid });

      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }

      message.status = MessageStatus;
      const updatedMessage = await message.save();

      res.status(200).json({ message: "Message status updated successfully" });
    } else {
      res.status(400).json({
        error: "Invalid request: MessageSid and MessageStatus are required",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating message status" });
  }
});

//GET ("/messages") get all messages 


export const getAllMessages = asyncHandler(async (req, res) => {
  try {
    const allMessages = await Message.find({});
    if (allMessages) {
      res.status(200).json({
        messages: allMessages,
      });
    } else {
      res.status(400).send("Smomething went wrong");
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating message status" });
  }
});
