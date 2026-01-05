import React, { useState } from "react";
import HomeNavbar from "../../Components/HomeNavbar/HomeNavbar.jsx";

const FAQs = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: "How do I create an account?",
      a: "Click on 'Sign Up' at the top right corner, fill in your information, and confirm your email.",
    },
    {
      q: "What is the return policy?",
      a: "We accept returns within 30 days from the purchase date. The product must be in its original condition.",
    },
    {
      q: "How long does shipping take?",
      a: "Standard shipping takes 3–5 business days. Express shipping is available for selected locations.",
    },
    {
      q: "Do you offer international shipping?",
      a: "Yes, we ship to over 100 countries. Shipping fees depend on your location.",
    },
    {
      q: "How can I track my order?",
      a: "You will receive a confirmation email with a tracking number. Use it to check your order status.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept credit cards, e-wallets, bank transfers, and cash on delivery.",
    },
    {
      q: "Do products come with a warranty?",
      a: "Yes, all products come with a 1-year warranty from the purchase date.",
    },
    {
      q: "How can I contact customer support?",
      a: "You can contact us via email, phone, or live chat. We are available 24/7.",
    },
  ];

  return (
    <>
      <HomeNavbar />

      <div className="w-full min-h-screen bg-gray-50 py-12">
        <div className="lg:container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold text-center mb-4 text-[#484848]">
            Frequently Asked Questions
          </h1>

          <p className="text-center text-gray-600 mb-12">
            Find quick answers to common questions
          </p>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow overflow-hidden">
                <button
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  className="w-full p-6 text-left font-semibold text-[#484848] hover:bg-gray-50 flex justify-between items-center"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`text-2xl transition-transform ${
                      openIdx === idx ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {openIdx === idx && (
                  <div className="px-6 pb-6 text-gray-600 border-t">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional contact */}
          <div className="bg-white p-8 rounded-lg shadow mt-12 text-center">
            <h2 className="text-xl font-semibold mb-2 text-[#484848]">
              Didn’t find your answer?
            </h2>
            <p className="text-gray-600 mb-4">
              Contact our support team
            </p>
            <button className="bg-[#484848] text-white px-6 py-2 rounded hover:bg-gray-700">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQs;
