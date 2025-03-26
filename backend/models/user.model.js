import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    papers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Paper' }],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);