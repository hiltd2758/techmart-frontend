import React from 'react';  
import { Link } from 'react-router-dom';  
import { FaHome, FaSearch, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';  
import HomeNavbar from '../../Components/HomeNavbar/HomeNavbar';  
import Footer from '../../Components/Footer/Footer';  
  
const NotFoundPage = () => {  
  return (  
    <>  
      <HomeNavbar />  
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">  
        <div className="max-w-2xl mx-auto text-center">  
          {/* Error Icon */}  
          <div className="mb-8">  
            <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">  
              <FaExclamationTriangle className="text-6xl text-red-600" />  
            </div>  
            <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>  
          </div>  
  
          {/* Error Message */}  
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">  
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>  
            <p className="text-lg text-gray-600 mb-6">  
              Oops! The page you're looking for seems to have vanished into the digital void.   
              Don't worry, even the best shopping destinations sometimes have missing aisles.  
            </p>  
            <p className="text-gray-500 mb-8">  
              This might have happened because:  
            </p>  
            <ul className="text-left text-gray-600 space-y-2 mb-8 max-w-md mx-auto">  
              <li className="flex items-center gap-3">  
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>  
                The URL was typed incorrectly  
              </li>  
              <li className="flex items-center gap-3">  
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>  
                The page was moved or deleted  
              </li>  
              <li className="flex items-center gap-3">  
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>  
                You followed a broken link  
              </li>  
            </ul>  
  
            {/* Action Buttons */}  
            <div className="flex flex-col sm:flex-row gap-4 justify-center">  
              <Link  
                to="/"  
                className="flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"  
              >  
                <FaHome />  
                Go to Homepage  
              </Link>  
              <button  
                onClick={() => window.history.back()}  
                className="flex items-center justify-center gap-3 px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"  
              >  
                <FaArrowLeft />  
                Go Back  
              </button>  
            </div>  
          </div>  
  
          {/* Helpful Links */}  
          <div className="text-center">  
            <p className="text-gray-500 mb-4">Looking for something specific?</p>  
            <div className="flex flex-wrap justify-center gap-3">  
              <Link  
                to="/product"  
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"  
              >  
                Browse Products  
              </Link>  
              <span className="text-gray-300">•</span>  
              <Link  
                to="/account"  
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"  
              >  
                My Account  
              </Link>  
              <span className="text-gray-300">•</span>  
              <Link  
                to="/contact"  
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"  
              >  
                Contact Support  
              </Link>  
            </div>  
          </div>  
        </div>  
      </div>  
      <Footer />  
    </>  
  );  
};  
  
export default NotFoundPage;