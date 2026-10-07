import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../navigation/Navbar';
import { Footer } from '../navigation/Footer';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cyber-bg text-cyber-text">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
