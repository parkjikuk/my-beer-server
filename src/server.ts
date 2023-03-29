import { ChatMessage, ChatMessageModel } from './models/ChatMessageModel';
import express from "express";
import cors from 'cors';
import userRoutes from "./routes/UserRoutes";
import { Server, Socket } from 'socket.io';
import chatRoutes from "./routes/ChatRoutes";
require('dotenv').config();

const dbUri: string | undefined = process.env.MONGODB_URI;
const clientUrl: string | undefined = process.env.CLIENT_URL;

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const app = express();
const port = 5000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://mybeer-78002.web.app");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, my-custom-header"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(express.json());
app.use(cors({
  origin: "https://mybeer-78002.web.app",
  credentials: true
}));

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("");
});


mongoose.connect("mongodb://paxkk:1234@svc.sel3.cloudtype.app:31179/?authMechanism=DEFAULT", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB 연결 성공');
  })
  .catch(() => {
    console.error('MongoDB 연결 실패: ');
  });

const db = mongoose.connection;

const beerAppDb = db.useDb('beerApp');
const chatDb = db.useDb('chat');

beerAppDb.once('open', () => {
  console.log('beerApp 데이터베이스 연결 성공');
});

chatDb.once('open', () => {
  console.log('chat 데이터베이스 연결 성공');
});

const server = app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: "https://mybeer-78002.web.app",
    credentials: true
  }
});

io.on("connection", (socket: Socket) => {
  console.log(`소켓 연결 ${socket.id}`)

  socket.on("join room", (roomId: string) => {
    console.log(`소켓 ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
  })

  socket.on("send message", (data: ChatMessage) => {
    const chatMessage = new ChatMessageModel(data);
    chatMessage.save();

    io.to(data.roomId).emit('receive message', data);
  });

  socket.on("leave room", (roomId: string) => {
    console.log(`소켓 ${socket.id} left room ${roomId}`);
    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    console.log(`소켓 연결 끊김 : ${socket.id}`);
  });
});