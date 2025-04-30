import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-blue-50 text-blue-900 min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white text-blue-950 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-900">Privacy Policy</h1>

        <p className="mb-4">
          At <strong>Pharmaceuticals</strong>, we value your privacy and are committed to protecting your personal data.
          This Privacy Policy outlines how we collect, use, and safeguard your information.
        </p>

        <h2 className="text-2xl font-semibold mt-6">1. Information We Collect</h2>
        <p className="mt-2">
          We may collect personal information such as your name, email, phone number, billing/shipping address, and payment details when you:
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Make a purchase from our website</li>
          <li>Sign up for our newsletter</li>
          <li>Contact our customer support team</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">2. How We Use Your Information</h2>
        <p className="mt-2">We use the collected information to:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>Process and fulfill orders</li>
          <li>Send promotional offers and updates</li>
          <li>Improve our website and services</li>
          <li>Ensure secure transactions</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">3. Data Security</h2>
        <p className="mt-2">
          We implement advanced security measures to protect your personal information from unauthorized access, alteration, or misuse.
          However, no online transmission is 100% secure.
        </p>

        <h2 className="text-2xl font-semibold mt-6">4. Third-Party Sharing</h2>
        <p className="mt-2">
          We do not sell or share your personal data with third parties, except for trusted partners who assist us in providing our services (such as payment gateways and shipping providers).
        </p>

        <h2 className="text-2xl font-semibold mt-6">5. Cookies & Tracking</h2>
        <p className="mt-2">
          We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings.
        </p>

        <h2 className="text-2xl font-semibold mt-6">6. Your Rights</h2>
        <p className="mt-2">
          You have the right to access, update, or request deletion of your personal data. For any privacy-related concerns, contact us at:
        </p>
        <p className="mt-4 font-semibold">📞 +91 84310 10081</p>
        <p>📧 khushboosoni.35@gmail.com</p>

        <h2 className="text-2xl font-semibold mt-6">7. Policy Updates</h2>
        <p className="mt-2">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
        </p>

        <p className="text-center mt-8 text-sm text-gray-600">
          Last Updated: 05/02/2025
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
