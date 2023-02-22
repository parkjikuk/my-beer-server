import { ChatMessage, ChatMessageModel } from './models/ChatMessageModel';
import express from "express";
import cors from 'cors';
import userRoutes from "./routes/UserRoutes";
import { Server, Socket } from 'socket.io';


const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const beerAppDb = mongoose.createConnection('mongodb://127.0.0.1:27017/beerApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const chatDb = mongoose.createConnection('mongodb://127.0.0.1:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

beerAppDb.once("open", () => {
  console.log("beerApp 데이터베이스 연결")
});

chatDb.once("open", () => {
  console.log("chat 데이터베이스 연결 성공")
});

app.use("/api/user", userRoutes);

const server = app.listen(port, () => {
  console.log("server started on port 5000")
});
const io = new Server(server);

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