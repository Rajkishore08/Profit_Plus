// src/pages/Home.js
import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto h-screen flex flex-col items-center justify-center px-4">
        {/* Header Section with Larger Logo */}
        <div className="text-center mb-16">  {/* Increased bottom margin */}
          <div className="flex justify-center mb-8">  {/* Added logo container */}
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">  {/* Larger logo size */}
            </div>
          </div>
          <img src="/Profitpluslogo.png" alt="Profit Plus Logo" class="logo" />
          <center>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome to Profit Plus
            </h1>

            <p className="text-xl text-gray-600">
              💰 Your complete business management solution
            </p>
          </center>
        </div>
        <br></br>
        {/* Card Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Salesperson Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl"><center>👤</center></span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Salesperson Portal
              </h2>
              <p className="text-gray-600 mb-8"></p>

              <button 
                onClick={() => navigate('/salesperson-login')}  
                className="w-1/2 bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Login as Salesperson
              </button>

              <button 
                onClick={() => navigate('/salesperson-dashboard')}  
                className="w-1/2 bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 mt-4"
              >
                Salesperson Dashboard
              </button>
            </div>
          </div>
          <br></br>
          {/* Owner Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">
                  <center>🏢</center>
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Owner Portal
              </h2>
              <p className="text-gray-600 mb-8"></p>

              <button 
                onClick={() => navigate('/owner-login')}  
                className="w-1/2 bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Login as Owner
              </button>

              <button 
                onClick={() => navigate('/owner-dashboard')}  
                className="w-1/2 bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 mt-4"
              >
                Owner Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-gray-500 text-sm"></div>
      </div>
    </div>
  );
};

export default Home;
