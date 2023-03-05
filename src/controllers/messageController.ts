import { Request, Response } from "express";
import { ChatMessageModel } from "../models/ChatMessageModel";

export const getChatMessages = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  try {
    const messages = await ChatMessageModel.find({ roomId })
    .sort({ _id: -1 })
    .limit(10)
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러" });
  }
};

export const postChatMessage = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { userName, message, email, myMessage} = req.body;
  const chatMessage  = new ChatMessageModel({ roomId, userName, message, email, myMessage });
  try {
    res.status(201).json(chatMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message : "서버 에러" });
  }
};
