import mongoose from 'mongoose';

export interface ChatMessage {
  _id: string;
  message: string;
  roomId: string;
  userName: string;
  email: string;
  myMessage: boolean;
}

const ChatMessageSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  message: String,
  roomId: String,
  userName: String,
  email: String,
  myMessage: Boolean,
});

export const ChatMessageModel = mongoose.model<ChatMessage>("ChatMessage", ChatMessageSchema)