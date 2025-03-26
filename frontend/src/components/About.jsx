import { useNavigate } from "react-router-dom";

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center py-12 px-4">
            {/* Hero Section */}
            <section className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800">About ResearchCast</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl">
                    Transform research papers into engaging podcasts and gain deeper insights  
                    by asking AI your questions via voice. Make complex knowledge accessible  
                    and easy to understand!
                </p>
            </section>

            {/* Card Container */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
                {/* AI-Powered Podcast Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
                    <img src="/about1.jpeg" alt="AI Podcast" className="w-full h-60 object-cover" />
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-800">AI-Powered Podcasts</h2>
                        <p className="mt-3 text-gray-600">
                            Our AI converts complex research papers into easy-to-understand  
                            podcasts, allowing you to absorb knowledge on the go.
                        </p>
                    </div>
                </div>

                {/* Interactive Learning Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
                    <img src="/about2.jpeg" alt="Voice Interaction" className="w-full h-60 object-cover" />
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Ask AI Your Questions</h2>
                        <p className="mt-3 text-gray-600">
                            Use voice input to ask AI any doubts while listening.  
                            Get instant explanations to enhance your understanding.
                        </p>
                    </div>
                </div>

                {/* Efficient Knowledge Retention Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
                    <img src="/about3.jpeg" alt="Knowledge Retention" className="w-full h-60 object-cover" />
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Simplified Learning</h2>
                        <p className="mt-3 text-gray-600">
                            AI-generated summaries and podcasts make consuming  
                            research papers easier, improving retention and comprehension.
                        </p>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <section className="text-center mt-12">
                <h2 className="text-3xl font-bold text-gray-800">Ready to Simplify Research?</h2>
                <p className="mt-3 text-lg text-gray-600">Start converting papers into podcasts and interact with AI for better learning!</p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-blue-700 transition-all cursor-pointer"
                >
                    Get Started
                </button>
            </section>
        </div>
    );
}