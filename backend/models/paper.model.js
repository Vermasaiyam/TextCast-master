import mongoose from "mongoose";

const paperSchema = new mongoose.Schema({
    title: { type: String, required: true },
    paperUrl: { type: String, required: true, unique: true },
    audioUrl: { type: String, required: false },
    transcription: { type: String, required: false },
    summary: { type: String, default: "Default summary" },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
}, { timestamps: true });

export const Paper = mongoose.model('Paper', paperSchema);