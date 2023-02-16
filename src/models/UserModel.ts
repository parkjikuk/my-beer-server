import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
    maxlength: 50,
  },
  likedBeers: Array,
});

export const User = mongoose.model('users', userSchema);