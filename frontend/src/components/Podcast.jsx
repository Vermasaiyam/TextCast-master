import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const PodcastPage = () => {
    const [searchParams] = useSearchParams();
    const paperId = searchParams.get("paperId");

    const [paper, setPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    if (loading) return <div className="text-center text-lg font-semibold">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!paper) return <div className="text-center text-gray-600">Paper not found.</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            {/* Title */}
            <h1 className="text-3xl font-bold text-center">{paper.title}</h1>

            {/* PDF Viewer */}
            <div className="text-center">
                <a
                    href={paper.paperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium underline"
                >
                    View Research Paper (PDF)
                </a>
            </div>

            {/* Summary */}
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
                <h2 className="text-xl font-semibold">Summary</h2>
                <p className="text-gray-700">{paper.summary}</p>
            </div>

            {/* Transcription */}
            {paper.transcription && (
                <div className="bg-gray-100 p-4 rounded-md shadow-md">
                    <h2 className="text-xl font-semibold">Transcription</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{paper.transcription}</p>
                </div>
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

// Audio Player Component
const AudioPlayer = ({ audioUrl }) => {
    const [audio] = useState(new Audio(audioUrl));
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(1.0);

    const togglePlay = () => {
        if (playing) {
            audio.pause();
        } else {
            audio.play();
        }
        setPlaying(!playing);
    };

    const changeSpeed = (factor) => {
        const newSpeed = Math.max(0.5, Math.min(2.0, speed + factor));
        setSpeed(newSpeed);
        audio.playbackRate = newSpeed;
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            <audio controls src={audioUrl} className="w-full"></audio>
            <div className="flex space-x-4">
                <button onClick={togglePlay} className="px-4 py-2 bg-blue-500 text-white rounded">
                    {playing ? "Pause" : "Play"}
                </button>
                <button onClick={() => changeSpeed(-0.25)} className="px-3 py-1 bg-gray-300 rounded">- Speed</button>
                <button onClick={() => changeSpeed(0.25)} className="px-3 py-1 bg-gray-300 rounded">+ Speed</button>
                <a href={audioUrl} download="podcast.mp3" className="px-4 py-2 bg-green-500 text-white rounded">
                    Download
                </a>
            </div>
            <p className="text-gray-600">Playback Speed: {speed.toFixed(2)}x</p>
        </div>
    );
};

export default PodcastPage;