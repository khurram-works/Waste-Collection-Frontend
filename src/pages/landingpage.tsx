import React from 'react';
import Header from './landingpagecomponents/header';
import Hero from './landingpagecomponents/hero';
import ProcessSection from './landingpagecomponents/processsection';
import WasteTypesSection from './landingpagecomponents/wastetypessection';
import CallToAction from './landingpagecomponents/calltoaction';
import Footer from './landingpagecomponents/footer';


const SmartWastePlatform = () => {

 
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-[#121614] dark:text-white transition-colors duration-200 min-h-screen">
      <Header />
      <Hero />
      <WasteTypesSection />
      <ProcessSection />
      <CallToAction />
      <Footer />
    </div>
  );
};


export default SmartWastePlatform;