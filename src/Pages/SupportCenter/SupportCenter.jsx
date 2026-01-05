import React from "react";
import HomeNavbar from "../../Components/HomeNavbar/HomeNavbar.jsx";

const SupportCenter = () => {
  const faqs = [
    {
      q: "How can I track my order?",
      a: "You can track your order via the confirmation email or your account.",
    },
    {
      q: "What is the return policy?",
      a: "We accept returns within 30 days from the purchase date.",
    },
    {
      q: "How long does delivery take?",
      a: "Standard delivery takes 3–5 business days.",
    },
  ];

  return (
    <>
      <HomeNavbar />

      <div className="w-full min-h-screen bg-gray-50 py-12">
        <div className="lg:container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12 text-[#484848]">
            Support Center
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Quick Contact */}
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-[#484848]">
                Quick Contact
              </h2>
              <div className="space-y-3">
                <p>Email: support@techmart.com</p>
                <p>Phone: 1-800-TECHMART</p>
                <p>Chat: Available 24/7</p>
                <p>Hours: Mon – Fri, 9AM – 6PM</p>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-[#484848]">
                Frequently Asked Questions
              </h2>
              <div className="space-y-2">
                {faqs.map((item) => (
                  <div key={item.q} className="border-b pb-2">
                    <p className="font-medium text-sm">{item.q}</p>
                    <p className="text-xs text-gray-600">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportCenter;
