import React from 'react';  
import { Link } from 'react-router-dom';  
import { FaHome, FaRedo, FaExclamationCircle, FaHeadset, FaBug } from 'react-icons/fa';  
import HomeNavbar from '../../Components/HomeNavbar/HomeNavbar';  
import Footer from '../../Components/Footer/Footer';  
  
const ServerErrorPage = () => {  
  const handleRetry = () => {  
    window.location.reload();  
  };  
  
  return (  
    <>  
      <HomeNavbar />  
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">  
        <div className="max-w-2xl mx-auto text-center">  
          {/* Error Icon */}  
          <div className="mb-8">  
            <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">  
              <FaExclamationCircle className="text-6xl text-orange-600" />  
            </div>  
            <h1 className="text-9xl font-bold text-gray-900 mb-4">500</h1>  
          </div>  
  
          {/* Error Message */}  
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">  
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Server Error</h2>  
            <p className="text-lg text-gray-600 mb-6">  
              Something went wrong on our end! Our technical team has been notified   
              and is working to fix this issue.  
            </p>  
            <p className="text-gray-500 mb-8">  
              This isn't your fault - it's us! These temporary glitches can happen when:  
            </p>  
            <ul className="text-left text-gray-600 space-y-2 mb-8 max-w-md mx-auto">  
              <li className="flex items-center gap-3">  
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>  
                We're performing system maintenance  
              </li>  
              <li className="flex items-center gap-3">  
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>  
                Too many shoppers are online at once  
              </li>  
              <li className="flex items-center gap-3">  
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>  
                A temporary technical issue occurred  
              </li>  
            </ul>  
  
            {/* Action Buttons */}  
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">  
              <button  
                onClick={handleRetry}  
                className="flex items-center justify-center gap-3 px-8 py-4 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"  
              >  
                <FaRedo />  
                Try Again  
              </button>  
              <Link  
                to="/"  
                className="flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"  
              >  
                <FaHome />  
                Go to Homepage  
              </Link>  
            </div>  
  
            {/* Support Section */}  
            <div className="bg-gray-50 rounded-xl p-6">  
              <div className="flex items-center justify-center gap-3 mb-3">  
                <FaHeadset className="text-gray-600" />  
                <span className="font-semibold text-gray-900">Still having trouble?</span>  
              </div>  
              <p className="text-gray-600 mb-4">  
                Our customer support team is here to help you 24/7  
              </p>  
              <div className="flex flex-col sm:flex-row gap-3 justify-center">  
                <Link  
                  to="/contact"  
                  className="flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"  
                >  
                  Contact Support  
                </Link>  
                <Link  
                  to="/support"  
                  className="flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"  
                >  
                  Visit Help Center  
                </Link>  
              </div>  
            </div>  
          </div>  
  
          {/* Error Reference */}  
          <div className="text-center text-sm text-gray-500">  
            <p>Error ID: ERR-{Date.now().toString(36).toUpperCase()}</p>  
            <p className="mt-2">  
              <FaBug className="inline mr-2" />  
              Reference this ID if you contact support  
            </p>  
          </div>  
        </div>  
      </div>  
      <Footer />  
    </>  
  );  
};  
  
export default ServerErrorPage;