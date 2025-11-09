import React, { useState, useEffect } from 'react';
<<<<<<< Updated upstream
import { Card } from '../ui/Card';
=======
import CardEnhanced from '../ui/Card-enhanced';
>>>>>>> Stashed changes

const ResponsiveTest: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="p-4">
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Responsive Design Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <h3 className="font-semibold mb-2">Screen Info</h3>
            <p>Width: {windowWidth}px</p>
            <p>Device: {isMobile ? 'Mobile' : 'Desktop/Tablet'}</p>
          </div>
          <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
            <h3 className="font-semibold mb-2">Navigation</h3>
            <p>Navbar adapts to screen size</p>
          </div>
          <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <h3 className="font-semibold mb-2">Content Layout</h3>
            <p>Grid adjusts based on viewport</p>
          </div>
        </div>
      </Card>

      {/* Test different component layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Chatbot Widget</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="mb-2">Desktop Position</p>
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-white">
                Chat
              </div>
            </div>
            <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="mb-2">Mobile Position</p>
              <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-white ml-auto">
                Chat
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Admin Dashboard</h3>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="font-medium">Project Status</span>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                  Active
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="font-medium">User Management</span>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  24 users
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResponsiveTest;
