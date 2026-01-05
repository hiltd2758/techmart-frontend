import React, { useState } from "react";
import HomeNavbar from "../../Components/HomeNavbar/HomeNavbar.jsx";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! We will get back to you within 24 hours.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <HomeNavbar />

      <div className="w-full min-h-screen bg-gray-50 py-12">
        <div className="lg:container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4 text-[#484848]">
            Contact Us
          </h1>

          <p className="text-center text-gray-600 mb-12">
            We’re here to help you
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact information */}
            <div>
              <div className="bg-white p-8 rounded-lg shadow space-y-6">
                <div>
                  <h3 className="font-semibold text-[#484848] mb-2">
                    Address
                  </h3>
                  <p className="text-sm text-gray-600">
                    UTH
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#484848] mb-2">
                    Phone
                  </h3>
                  <p className="text-sm text-gray-600">
                    TECHMART
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#484848] mb-2">
                    Email
                  </h3>
                  <p className="text-sm text-gray-600">
                    contact@techmart.com
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#484848] mb-2">
                    Business Hours
                  </h3>
                  <p className="text-sm text-gray-600">
                    Monday – Friday: 9AM – 6PM
                  </p>
                  <p className="text-sm text-gray-600">
                    Saturday – Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-lg shadow"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-[#484848]">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-[#484848]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-[#484848]">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-[#484848]">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#484848] text-white py-2 rounded hover:bg-gray-700 font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
