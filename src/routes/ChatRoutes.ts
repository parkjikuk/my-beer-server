import { Router } from "express";
import { getChatMessages, postChatMessage } from "../controllers/messageController";

const chatRoutes = Router();

// GET /api/chat/:roomId/messages
chatRoutes.get("/:roomId/messages", getChatMessages);

// POST /api/chat/:roomId/messages
chatRoutes.post("/:roomId/messages", postChatMessage);

export default chatRoutes;