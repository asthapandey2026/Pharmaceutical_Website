import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="bg-blue-50 text-blue-100 min-h-screen px-6 py-12">
      <div className="max-w-4xl mt-10 mx-auto bg-white text-blue-950 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-950 mb-6">
          Terms & Conditions
        </h1>

        <p className="text-md text-gray-700 mb-6 text-center">
          Last Updated: <span className="font-semibold">5/02/2025</span>
        </p>

        {/* General */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-blue-950 mb-2">1. General</h2>
          <p className="text-gray-700">
            These terms apply to all users of the website, including customers, browsers, vendors, and merchants. We reserve the right to modify or update these terms at any time. Continued use of our website constitutes acceptance of any changes.
          </p>
        </section>

        {/* Products & Orders */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-blue-950 mb-2">2. Products & Orders</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Our skincare and cosmetic products are for personal use only and not for resale.</li>
            <li>Prices, descriptions, and availability of products are subject to change without notice.</li>
            <li>We reserve the right to cancel or refuse any order at our discretion.</li>
          </ul>
        </section>

        {/* Payment & Pricing */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-blue-950 mb-2">3. Payment & Pricing</h2>
          <p className="text-gray-700">
            Prices are displayed in [Currency] and are subject to applicable taxes and shipping fees. We accept payments via [Payment Methods]. By providing payment details, you confirm that you are authorized to use the chosen payment method.
          </p>
        </section>

        {/* Shipping & Delivery */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-blue-950 mb-2">4. Shipping & Delivery</h2>
          <p className="text-gray-700">
            We strive to process and ship orders promptly. Delivery times vary based on location and shipping method. We are not responsible for delays caused by external factors such as courier issues, customs, or force majeure events.
          </p>
        </section>

        {/* Returns & Refunds */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-blue-950 mb-2">5. Returns & Refunds</h2>
          <p className="text-gray-700">
            Due to the nature of skincare and cosmetic products, returns are only accepted if the item is defective, damaged, or incorrect. Refund requests must be made within **[X] days** of receiving the order with proof of purchase.
          </p>
        </section>

        {/* Product Disclaimer */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-blue-950 mb-2">6. Product Disclaimer</h2>
          <p className="text-gray-700">
            Our products are dermatologically tested, but individual reactions may vary. Perform a patch test before full application. We are not responsible for any allergic reactions or side effects.
          </p>
        </section>

        {/* Intellectual Property */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-blue-950 mb-2">7. Intellectual Property</h2>
          <p className="text-gray-700">
            All website content, including images, logos, and text, is the property of **Pharmaceuticals** and may not be copied, reproduced, or distributed without permission.
          </p>
        </section>

        {/* Privacy Policy */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-blue-950 mb-2">8. Privacy Policy</h2>
          <p className="text-gray-700">
            Your personal data is collected and used in accordance with our <a href="/privacyPolicy" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-blue-950 mb-2">9. Limitation of Liability</h2>
          <p className="text-gray-700">
            We are not liable for any indirect, incidental, or consequential damages resulting from the use of our products or website.
          </p>
        </section>

        {/* Governing Law & Disputes */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-blue-950 mb-2">10. Governing Law & Disputes</h2>
          <p className="text-gray-700">
            These terms are governed by the laws of [Your Country/State]. Any disputes will be resolved through arbitration or legal proceedings.
          </p>
        </section>

        {/* Contact Information */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-blue-950 mb-2">11. Contact Information</h2>
          <p className="text-gray-700">
            📧 <a href="mailto:[khushboosoni.35@gmail.com]" className="hover:underline">khushboosoni.35@gmail.com</a>  
            <br />
            📞 <span>+91 84310 10081</span>  
            <br />
            📍 <span>[Thindlu, Vidyaranyapura, Bangalore - 560097]</span>
          </p>
        </section>

        {/* Footer */}
        <p className="text-center text-gray-600 mt-8">
          By using our website, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
