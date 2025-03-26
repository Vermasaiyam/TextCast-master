import React, { useState, useEffect } from "react";

const carouselTexts = [
    "Convert research papers into engaging podcasts effortlessly.",
    "Transform complex research into easy-to-listen audio summaries.",
    "Listen to AI-narrated research papers anytime, anywhere.",
    "Ask AI your doubts via voice and get instant explanations.",
    "Make research more accessible with AI-powered podcasts and Q&A."
];

const TextCarousel = () => {
    const [index, setIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);

            setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % carouselTexts.length);
                setIsVisible(true);
            }, 500);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-center min-w-full max-w-full mx-auto px-4">
            <h1
                key={index}
                className={`text-3xl md:text-4xl font-extrabold my-6 text-white transition-opacity transform duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                    }`}
            >
                {carouselTexts[index]}
            </h1>

            <p className="mt-2 text-lg md:text-xl text-gray-300 my-6 mb-8">
                Convert research papers into immersive podcasts for effortless learning.
                Ask AI your questions via voice and get instant explanations,
                making complex information more accessible and engaging.
            </p>

        </div>
    );
};

export default TextCarousel;