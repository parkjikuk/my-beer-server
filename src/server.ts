import express from "express";
import cors from 'cors';
import userRoutes from "./routes/UserRoutes";

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/beerApp')
.then(() => {
  console.log("연결 성공!!!!");
})
.catch((err: any) => {
  console.log(err.message);
});

app.use("/api/user", userRoutes);

app.listen(port, () => {
  console.log("server started on port 5000")
});