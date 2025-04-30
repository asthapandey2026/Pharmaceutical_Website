import React, { useState } from "react";
import EnquiryButton from "../components/EnquiryButton";
import EnquiryPopup from "../components/EnquiryPopup";
import api from "../utils/axios";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const { data } = await api.post('/contact', formData);
            alert(data.message); // Show success message
            setFormData({ name: '', email: '', subject: '', message: '' }); // Clear the form
        } catch (error) {
            console.error('Error sending message:', error);
            alert(error.response?.data?.message || 'Failed to send message.');
        }
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-950 to-blue-700 h-80 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-white text-4xl md:text-5xl font-bold">
                        Contact <span className="text-blue-200">Pharmaceuticals</span>
                    </h1>
                    <p className="text-blue-100 mt-2 text-lg">We'd love to hear from you!</p>
                </div>
            </div>

            {/* Contact Information */}
            <div className="max-w-6xl mx-auto px-6 py-10 text-center">
                <h2 className="text-3xl font-bold text-gray-800">Get in Touch</h2>
                <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
                    Reach out to us for inquiries, support, or collaboration. We're always happy to help.
                </p>
                <div className="grid md:grid-cols-3 gap-8 mt-8">
                    <div className="p-6 bg-white rounded-lg shadow-md text-center">
                        <h3 className="text-2xl font-bold text-gray-800">📞 Call Us</h3>
                        <p className="text-gray-600 mt-2">+91 84310 10081</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md text-center">
                        <h3 className="text-2xl font-bold text-gray-800">📧 Email Us</h3>
                        <p className="text-gray-600 mt-2">khushboosoni.35@gmail.com</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md text-center">
                        <h3 className="text-2xl font-bold text-gray-800">📍 Visit Us</h3>
                        <p className="text-gray-600 mt-2"> 80/4/6, 2nd Floor, Siddalingeshwara Layout, 
                        Thindlu, Vidyaranyapura, Bangalore - 560097, India</p>
                    </div>
                </div>
            </div>

            {/* Contact Form */}
            <div className="bg-blue-50 py-10">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800">Send Us a Message</h2>
                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-800"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-800"
                            required
                        />
                        <textarea
                            name="message"
                            rows="5"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-800"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-all"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>

            {/* Enquiry Section */}
            <div>
                <EnquiryButton />
                <EnquiryPopup />
            </div>
        </div>
    );
};

export default ContactUs;
