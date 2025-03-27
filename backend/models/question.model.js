import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        questionAudio: { type: String, required: false },
        questionText: { type: String, required: true },
        answerText: { type: String, required: true },
        answerAudio: { type: String, required: false },
    },
    { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);