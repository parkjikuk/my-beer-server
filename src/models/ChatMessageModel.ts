import mongoose from 'mongoose';

export interface ChatMessage {
  id: string;
  message: string;
  roomId: string;
}

const ChatMessageSchema = new mongoose.Schema({
  id: String,
  message: String,
  roomId: String,
});

export const ChatMessageModel = mongoose.model<ChatMessage>("ChatMessage", ChatMessageSchema)