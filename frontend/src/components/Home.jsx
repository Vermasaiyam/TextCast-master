import TextCarousel from "./TextCrousel";

const PAPER_API_END_POINT = import.meta.env.VITE_API_END_POINT_PAPER;
const FLASK_API_END_POINT = import.meta.env.VITE_FLASK_END_POINT;

export default function Home() {


    return (
        <div className="bg-[#0B1930] min-h-[90vh] flex flex-col items-center justify-center text-white p-4">

            <div className="flex flex-col items-center justify-center text-white">
                <TextCarousel />
            </div>

            {/* Input Box Section */}
            
        </div>
    );
}