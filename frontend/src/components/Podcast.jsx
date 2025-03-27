import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Download, Play, Pause } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PodcastPage = () => {
    const [searchParams] = useSearchParams();
    const paperId = searchParams.get("paperId");

    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expanded, setExpanded] = useState({ summary: false, transcription: false });

    useEffect(() => {
        if (!paperId) return;

        const fetchPaperDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/paper/${paperId}`);
                setPaper(response.data);
            } catch (err) {
                setError("Failed to fetch paper details");
            } finally {
                setLoading(false);
            }
        };

        fetchPaperDetails();
    }, [paperId]);

    if (loading) return <Skeleton height={500} />;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!paper) return <div className="text-center text-gray-600">Paper not found.</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold text-center">{paper.title}</h1>

            {/* PDF Viewer */}
            <div className="flex justify-center">
                <a
                    href={paper.paperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-60 h-44 bg-gray-200 rounded-lg shadow-md flex flex-col items-center justify-center hover:bg-gray-300 transition"
                >
                    <img src="/pdf.png" alt="PDF" className="w-32 h-16" />
                    <p className="mt-2 text-gray-700 font-medium">View PDF</p>
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-20 opacity-0 rounded-lg hover:opacity-80 flex items-center justify-center transition">
                        <span className="text-white font-semibold">View</span>
                    </div>
                </a>
            </div>

            {/* Summary */}
            <ExpandableText title="Summary" text={paper.summary} expanded={expanded.summary} setExpanded={() => setExpanded({ ...expanded, summary: !expanded.summary })} />

            {/* Transcription */}
            {paper.transcription && (
                <ExpandableText title="Transcription" text={paper.transcription} expanded={expanded.transcription} setExpanded={() => setExpanded({ ...expanded, transcription: !expanded.transcription })} />
            )}

            {/* Audio Player */}
            {paper.audioUrl && (
                <div className="bg-gray-100 p-4 rounded-md shadow-md">
                    <h2 className="text-xl font-semibold">Podcast Audio</h2>
                    <AudioPlayer audioUrl={paper.audioUrl} />
                </div>
            )}
        </div>
    );
};

const ExpandableText = ({ title, text, expanded, setExpanded }) => {
    const preview = text.split(" ").slice(0, 50).join(" ") + "...";
    return (
        <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{expanded ? text : preview}</p>
            <button onClick={setExpanded} className="text-blue-500 font-medium mt-2">
                {expanded ? "Read Less" : "Read More"}
            </button>
        </div>
    );
};

const AudioPlayer = ({ audioUrl }) => {
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(1.0);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (playing) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setPlaying(!playing);
        }
    };

    // ✅ This useEffect ensures that the playback rate updates correctly
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = speed;
        }
    }, [speed]);

    const changeSpeed = (e) => {
        const newSpeed = parseFloat(e.target.value);
        setSpeed(newSpeed);
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(audioUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "podcast.mp3";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
            {/* Audio Element */}
            <audio ref={audioRef} controls src={audioUrl} className="w-full" />

            {/* Controls */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={togglePlay}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
                    {playing ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                    {playing ? "Pause" : "Play"}
                </button>

                {/* Speed Control Dropdown */}
                <select
                    onChange={changeSpeed}
                    value={Number(speed)}
                    className="px-3 py-1 border rounded-md bg-gray-100 shadow-md">
                    <option value="0.5">0.5x</option>
                    <option value="1.0">1x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2.0">2x</option>
                </select>

                {/* Download Button */}
                <button
                    onClick={handleDownload}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition">
                    <Download className="w-5 h-5 mr-2" />
                    Download
                </button>
            </div>
        </div>
    );
};


export default PodcastPage;