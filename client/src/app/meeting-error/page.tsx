import React from "react";
import Link from "next/link";

const MeetingError: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-4 text-gray-600">
            You can't access this meeting. Please ensure you have the correct
            permissions and try again.
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <Link href="#replace-with-original-link">
            <button className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition duration-200">
              Go to Homepage
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MeetingError;
