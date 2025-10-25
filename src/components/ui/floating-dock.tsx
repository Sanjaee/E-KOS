import React from 'react';
import { Home, User, Folder, Bookmark, Menu } from 'lucide-react';

const FloatingNav = () => {
  const menuItems = [
    { icon: <Home className="w-6 h-6" />, label: 'Home' },
    { icon: <User className="w-6 h-6" />, label: 'Profile' },
    { icon: <Folder className="w-6 h-6" />, label: 'Files' },
    { icon: <Bookmark className="w-6 h-6" />, label: 'Bookmarks' },
    { icon: <Menu className="w-6 h-6" />, label: 'Menu' }
  ];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="relative">
        {/* Blur effect background */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-lg rounded-full" />
        
        {/* Navigation items */}
        <div className="relative flex items-center gap-4 px-4 py-2 rounded-full">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="p-2 rounded-full text-white/80 hover:text-white transition-colors duration-200"
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingNav;