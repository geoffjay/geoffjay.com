import React from "react";
import { Camera, ArrowRight, Lock } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
        {/* Brand Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-lg mb-2">
            <Camera size={40} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Photo Gallery
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Intelligent photo organization powered by Gemini
            </p>
          </div>
        </div>

        {/* Login Action */}
        <div className="space-y-6 pt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400 font-medium tracking-wider">
                Authentication Required
              </span>
            </div>
          </div>

          <button
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-medium py-3.5 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5 z-10"
            />
            <span className="z-10">Sign in with Google</span>
            <ArrowRight
              size={16}
              className="text-gray-400 group-hover:translate-x-1 transition-transform z-10"
            />

            {/* Hover effect background */}
            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <div className="bg-blue-50/50 rounded-lg p-4 flex gap-3 items-start border border-blue-100">
            <Lock size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Secure access to the photo library is controlled via your Google
              Cloud credentials. Please ensure you select a valid API key linked
              to a billing-enabled project.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400">
          &copy; {new Date().getFullYear()} Geoff Johnson. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
