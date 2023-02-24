import { Request, Response } from "express";
import { ChatMessageModel } from "../models/ChatMessageModel";

export const getChatMessages = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  try {
    const messages = await ChatMessageModel.find({ roomId });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러" });
  }
};

export const postChatMessage = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const { username, content } = req.body;
  const message = new ChatMessageModel({ roomId, username, content });
  try {
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러" });
  }
};
