import React from "react";

const AboutCompany = () => {
  return (
    <div className="bg-white py-10 shadow rounded-lg">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800">About Us</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mt-4">
          Welcome to <b>Pharmaceuticals</b>, where quality meets authenticity. We we are committed to pure, science-backed, and harsh chemical-free skincare, delivering premium quality, ethical integrity, and innovative formulations that empower every individual to glow boldly, authentically, and without limits. 
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-6">
          <div className="bg-white shadow-lg rounded-lg p-4 w-72 text-center hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-gray-900">🌿 Our Mission</h3>
            <p className="text-gray-600 text-xs mt-2">
            Pharmaceuticals Cosmetics pioneers the future of personal care with uncompromisingly pure, science-powered formulations that transcend industry norms. We craft premium, harsh chemical-free products for every skin story, blending radical innovation with ethical integrity to prove that luxury and safety can coexist—empowering everyone to glow boldly, authentically, and without limits.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 w-72 text-center hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-gray-900">🌎 Our Vision</h3>
            <p className="text-gray-600 text-sm mt-2">
            To revolutionize skincare by unveiling the true essence of beauty—where every product ignites confidence, celebrates individuality, and redefines purity in a world cluttered by compromise.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 w-72 text-center hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-gray-900">🏆 Why Choose Us?</h3>
            <p className="text-gray-600 text-sm mt-2">
              We ensure purity, sustainability, and effectiveness in every product. We provide Pure, science-powered skincare that celebrates your natural beauty with confidence and integrity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCompany;
