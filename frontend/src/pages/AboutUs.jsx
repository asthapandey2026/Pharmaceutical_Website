import React from "react";
import AboutCard from "../components/AboutCard";
import EnquiryButton from "../components/EnquiryButton";
import EnquiryPopup from "../components/EnquiryPopup";

const AboutUs = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-950 to-blue-700 h-80 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-white text-4xl md:text-5xl font-bold">
                        About <span className="text-blue-200">Pharmaceuticals</span>
                    </h1>
                    <p className="text-blue-100 mt-2 text-lg">Bringing Ayurveda to the Modern World</p>
                </div>
            </div>

            {/* Introduction Section */}
            <div className="max-w-6xl mx-auto px-6 py-10 text-center">
                <h2 className="text-3xl font-bold text-gray-800">Pharmaceuticals</h2>
                <p className="text-gray-600 mt-4 max-w-6xl mx-auto">
                The name "Pharmaceuticals" combines two key concepts that resonate with the essence of the cosmetic products being offered. "Bare" suggests a natural, minimalistic approach, emphasizing purity and simplicity in beauty. It implies that the products are free from unnecessary additives and focus on essential ingredients. "Best" conveys a commitment to quality and excellence, indicating that the products are among the finest available. Together, the name reflects a philosophy of providing high-quality, straightforward cosmetic solutions that prioritize the natural beauty of the user.                </p>
            </div>

            {/* Mission & Vision Section */}
            <div className="bg-blue-50 py-10">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
                    <div className="p-6 bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-all">
                        <h3 className="text-2xl font-bold text-gray-800">🌿 Our Mission</h3>
                        <p className="text-gray-600 mt-3">
                        Pharmaceuticals Cosmetics pioneers the future of personal care with uncompromisingly pure, science-powered formulations that transcend industry norms. We craft premium, harsh chemical-free products for every skin story, blending radical innovation with ethical integrity to prove that luxury and safety can coexist—empowering everyone to glow boldly, authentically, and without limits.
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-all">
                        <h3 className="text-2xl font-bold text-gray-800">🌎 Our Vision</h3>
                        <p className="text-gray-600 mt-3">
                             To revolutionize skincare by unveiling the true essence of beauty—where every product ignites confidence, celebrates individuality, and redefines purity in a world cluttered by compromise.
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <AboutCard />
            </div>


            {/* Commitment Section */}
            <div className="bg-gradient-to-r from-blue-950 to-blue-700 text-white py-10 text-center">
                <h2 className="text-3xl font-bold">Our Commitment</h2>
                <p className="max-w-3xl mx-auto mt-4 text-lg">
                At Pharmaceuticals, we are committed to pure, science-backed, and harsh chemical-free skincare, delivering premium quality, ethical integrity, and innovative formulations that empower every individual to glow boldly, authentically, and without limits.
                </p>
            </div>

            {/* Footer Call to Action */}
            <div className="text-center py-8">
                <h3 className="text-2xl font-bold text-gray-800">Want to Learn More?</h3>
                <p className="text-gray-600">Explore our wide range of <b>Skincare and Cosmetics</b>.</p>
                <a href="/products" className="mt-4 inline-block bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-950 transition-all">
                    Explore Products
                </a>
            </div>
            <div>
                <EnquiryButton />
                <EnquiryPopup />
            </div>
        </div>
    );
};

export default AboutUs;
