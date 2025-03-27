import express from "express";
import { getPaper, uploadPaper } from "../controllers/paper.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post(
    "/upload",
    upload.fields([
        { name: "paper", maxCount: 1 },
        { name: "audio", maxCount: 1 },
    ]),
    uploadPaper
);
router.get("/:paperId", getPaper);


export default router;