import React from 'react';
import { Home, User, Bell, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Layout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto flex gap-4">
        {/* Sidebar */}
        <aside className="w-64 fixed h-screen p-4">
          <div className="flex flex-col h-full">
            <Link to="/" className="text-2xl font-bold mb-8">𝕏</Link>
            
            <nav className="space-y-4 flex-grow">
              <Link
                to="/"
                className={`flex items-center gap-4 text-xl p-2 rounded-full hover:bg-gray-900 ${
                  location.pathname === '/' ? 'font-bold' : ''
                }`}
              >
                <Home /> Home
              </Link>
              
              <Link
                to="/profile"
                className={`flex items-center gap-4 text-xl p-2 rounded-full hover:bg-gray-900 ${
                  location.pathname === '/profile' ? 'font-bold' : ''
                }`}
              >
                <User /> Profile
              </Link>
              
              <Link
                to="/notifications"
                className={`flex items-center gap-4 text-xl p-2 rounded-full hover:bg-gray-900 ${
                  location.pathname === '/notifications' ? 'font-bold' : ''
                }`}
              >
                <Bell /> Notifications
              </Link>
            </nav>

            <button
              onClick={signOut}
              className="flex items-center gap-4 text-xl p-2 rounded-full hover:bg-gray-900 mt-auto mb-4"
            >
              <LogOut /> Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="ml-64 flex-grow max-w-2xl border-x border-gray-800">
          {children}
        </main>

        {/* Right sidebar */}
        <aside className="w-80 p-4">
          <div className="bg-gray-900 rounded-xl p-4">
            <h2 className="text-xl font-bold mb-4">Who to follow</h2>
            {/* Add suggested users component here */}
          </div>
        </aside>
      </div>
    </div>
  );
}