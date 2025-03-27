import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from 'axios';
import { Loader2 } from "lucide-react";
import TextCarousel from "./TextCrousel";
import { useSelector } from "react-redux";

const PAPER_API_END_POINT = import.meta.env.VITE_API_END_POINT_PAPER;
const FLASK_API_END_POINT = import.meta.env.VITE_FLASK_END_POINT;

export default function Home() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const { user } = useSelector(store => store.auth);

    const loadingTexts = [
        "Uploading file...",
        "Transcribing file...",
        "Generating podcast text...",
        "Converting to audio...",
        "Processing audio... Please wait...",
    ];

    const [loadingStep, setLoadingStep] = useState(0);

    useEffect(() => {
        if (loading) {
            let step = 0;
            const interval = setInterval(() => {
                setLoadingStep((prev) => {
                    if (prev + 1 < loadingTexts.length) {
                        return prev + 1;
                    } else {
                        clearInterval(interval);
                        return prev;
                    }
                });
            }, 6000);

            return () => clearInterval(interval);
        } else {
            setLoadingStep(0);
        }
    }, [loading]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            setLoading(true);
    
            // Step 1: Upload PDF to Flask API
            const formData = new FormData();
            formData.append("pdf", file);
    
            const flaskResponse = await axios.post("http://127.0.0.1:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            if (flaskResponse.status !== 200) {
                throw new Error("Failed to process the PDF");
            }
    
            const { podcastUrl, summaries, podcast_script } = flaskResponse.data;
            console.log("Flask API Response:", { podcastUrl, summaries, podcast_script });
    
            // Step 2: Download the audio file from Flask's static URL
            const audioResponse = await fetch(`http://127.0.0.1:5000${podcastUrl}`);
            if (!audioResponse.ok) {
                throw new Error("Failed to fetch the audio file from Flask server");
            }
    
            const audioBlob = await audioResponse.blob();
            const audioFile = new File([audioBlob], "podcast.mp3", { type: "audio/mpeg" });
    
            // Step 3: Upload to Node.js Backend
            const nodeFormData = new FormData();
            nodeFormData.append("paper", file); // PDF file
            nodeFormData.append("audio", audioFile); // Attach audio file
            nodeFormData.append("transcription", podcast_script);
            nodeFormData.append("summary", summaries.join("\n"));
            nodeFormData.append("title", file.name);
            nodeFormData.append("userId", user?._id); // Ensure userId is passed
    
            const nodeResponse = await axios.post("http://localhost:8000/api/paper/upload", nodeFormData, {
                headers: { "Content-Type": "multipart/form-data" }, // Set correct header
            });
    
            const { _id: paperId } = nodeResponse.data;
            console.log("Paper created with ID:", paperId);
    
            // Step 4: Navigate to Podcast Page
            navigate(`/podcast?paperId=${paperId}`);
    
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("File upload failed");
        } finally {
            setLoading(false);
        }
    };

    
    return (
        <div className="bg-[#0B1930] min-h-[90vh] flex flex-col items-center justify-center text-white p-4">

            <div className="flex flex-col items-center justify-center text-white">
                <TextCarousel />
            </div>

            {/* Input Box Section */}
            <div className="bg-white text-gray-900 w-full max-w-xl mt-6 p-6 rounded-2xl shadow-lg">
                <h2 className="text-md font-bold mb-4">Convert research papers into podcasts and ask AI your questions via voice for instant explanations.</h2>

                <div className="py-6 bg-white rounded-lg shadow-lg">
                    <label className="block text-lg font-semibold text-gray-800 mb-3">Upload Research Paper here:</label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-4 hover:border-indigo-500 hover:bg-gray-50 transition duration-300">
                        <input
                            type="file"
                            accept=".pdf"
                            className="w-full text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 hover:bg-gray-200 file:hidden"
                            onChange={handleFileChange}
                        />
                        <div className="text-gray-500 text-sm">
                            <p>Click to upload or drag and drop files here</p>
                        </div>
                    </div>
                </div>

                <div>
                    <button
                        className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 hover:bg-blue-700 cursor-pointer"
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center w-full cursor-not-allowed">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {loadingTexts[loadingStep]}
                            </div>
                        ) : (
                            <span className="text-white font-bold lg:text-lg text-base px-1">
                                Research papers to podcasts—ask AI! →
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}