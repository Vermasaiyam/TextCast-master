import { Paper } from "../models/paper.model.js";
import { User } from "../models/user.model.js";
import { Question } from "../models/question.model.js";
import cloudinary from "../utils/cloudinary.js";

export const uploadPaper = async (req, res) => {
    try {
        console.log("Received files:", req.files); // Debugging

        const { title, transcription, summary, userId } = req.body;
        const pdfFile = req.files?.["paper"]?.[0];
        const mp3File = req.files?.["audio"]?.[0];

        if (!pdfFile) {
            return res.status(400).json({ error: "PDF file is required" });
        }

        if (!mp3File) {
            return res.status(400).json({ error: "MP3 file is required" });
        }

        // Upload PDF to Cloudinary
        cloudinary.uploader.upload_stream(
            { resource_type: "raw", folder: "papers" },
            async (error, result) => {
                if (error) {
                    console.error("Error uploading PDF:", error);
                    return res.status(500).json({ error: "PDF upload failed" });
                }

                const paperUrl = result.secure_url;

                // Upload MP3 to Cloudinary
                cloudinary.uploader.upload_stream(
                    { resource_type: "video", folder: "podcasts" },
                    async (error, result) => {
                        if (error) {
                            console.error("Error uploading MP3:", error);
                            return res.status(500).json({ error: "MP3 upload failed" });
                        }

                        const audioUrl = result.secure_url;

                        // Create Paper Document
                        const newPaper = new Paper({
                            title,
                            paperUrl,
                            audioUrl,
                            transcription,
                            summary,
                        });

                        const savedPaper = await newPaper.save();

                        // Push paper ID into user's papers array
                        await User.findByIdAndUpdate(userId, {
                            $push: { papers: savedPaper._id },
                        });

                        return res.status(201).json(savedPaper);
                    }
                ).end(mp3File.buffer);
            }
        ).end(pdfFile.buffer);
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getPaper = async (req, res) => {
    try {
        const { paperId } = req.params;
        const paper = await Paper.findById(paperId).populate("questions");

        if (!paper) {
            return res.status(404).json({ message: "Paper not found" });
        }

        res.json(paper);
    } catch (error) {
        console.error("Error fetching paper:", error);
        res.status(500).json({ message: "Server error" });
    }
};