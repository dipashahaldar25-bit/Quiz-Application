import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import TopScoresPreview from '../components/home/TopScoresPreview';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <HeroSection />
        <HowItWorks />
        <TopScoresPreview />
      </div>
      <Footer />
    </div>
  );
}
