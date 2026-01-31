
import React, { useState } from 'react';
import ConciergeWidget from './components/ConciergeWidget';
import { AgentConfig } from './types';

const SaaS_DEMO_CONFIGS: Record<string, AgentConfig> = {
  medSpa: {
    businessName: 'Azure Medical Spa',
    businessType: 'Luxury Wellness Center',
    primaryGoal: 'Prequalify for treatments and book skin consultations',
    tone: 'Soothing, professional, elegant, and expert',
    qualificationQuestions: [
      'What skin concerns are you currently focused on?',
      'Have you received cosmetic treatments before?',
      'Are you looking for a single session or a long-term plan?'
    ],
    handoffCTA: 'Book a skin analysis consultation',
    voiceName: 'Zephyr'
  },
  cosmeticDentistry: {
    businessName: 'Smile Design Studio',
    businessType: 'Cosmetic & Implant Dentistry',
    primaryGoal: 'Book an implant or cosmetic consultation',
    tone: 'Reassuring, calm, professional, and empathetic',
    qualificationQuestions: [
      'Are you interested in implants, cosmetic enhancements, or addressing specific dental pain?',
      'Is this an urgent concern or a planned improvement?',
      'Will you be using insurance or prefer self-pay options?',
      'How soon would you like to begin your treatment?'
    ],
    handoffCTA: 'Book a smile transformation consultation',
    voiceName: 'Kore'
  },
  realEstate: {
    businessName: 'Luxe Realty Group',
    businessType: 'Residential Real Estate',
    primaryGoal: 'Route to buyer or seller consultation',
    tone: 'Knowledgeable, confident, friendly, and helpful',
    qualificationQuestions: [
      'Are you looking to buy a new home or sell your current property?',
      'What price range are you considering?',
      'What is your ideal move-in or closing timeline?',
      'If buying, have you already secured financing or pre-approval?'
    ],
    handoffCTA: 'Schedule a real estate strategy call',
    voiceName: 'Zephyr'
  },
  homeServices: {
    businessName: 'Total Home Comfort',
    businessType: 'HVAC, Roofing, and Plumbing',
    primaryGoal: 'Assess emergency status and dispatch relevant technicians',
    tone: 'Practical, reliable, urgent, and trustworthy',
    qualificationQuestions: [
      'Is this an emergency situation or a standard service request?',
      'What is your service zip code?',
      'Do you have a rough budget range in mind for this project?',
      'When would you like the technician to arrive?'
    ],
    handoffCTA: 'Request a service dispatch',
    voiceName: 'Fenrir'
  }
};

const App: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('medSpa');

  return (
    <div className="min-h-screen bg-white">
      {/* SaaS Landing Header */}
      <nav className="border-b p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full opacity-50" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">Live Concierge</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-indigo-600 transition-colors">Platform</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Case Studies</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Docs</a>
        </div>
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
          Get Started
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <div>
            <div className="inline-block bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full text-xs font-bold mb-6">
              REFACTOR COMPLETE: MULTI-TENANT ENGINE 2.0
            </div>
            <h1 className="text-6xl font-extrabold text-slate-900 leading-[1.1] mb-8">
              Turn your visitors into <span className="text-indigo-600">qualified leads</span> while you sleep.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-lg">
              Live Concierge is a generic engine designed to handle voice and chat interactions for any industry. Install the widget, configure your brand, and let our AI qualify every lead.
            </p>
            
            {/* Industry Demo Tabs */}
            <div className="mb-10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Try a Live Demo For:</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(SaaS_DEMO_CONFIGS).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveDemo(key)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                      activeDemo === key
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400'
                    }`}
                  >
                    {SaaS_DEMO_CONFIGS[key].businessName}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
               <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
                 Deploy to Website
               </button>
               <button className="border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                 View SDK Docs
               </button>
            </div>
          </div>

          <div className="relative sticky top-20">
            <div className="absolute -inset-4 bg-indigo-100 rounded-[40px] -z-10 blur-3xl opacity-50" />
            <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl border border-white/10 text-white transition-all duration-500">
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                 <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-500" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500" />
                   <div className="w-3 h-3 rounded-full bg-green-500" />
                 </div>
                 <div className="text-xs font-mono text-slate-400">agent_config.json</div>
              </div>
              <pre className="text-sm font-mono text-indigo-300 overflow-x-auto min-h-[220px]">
{JSON.stringify({
  businessName: SaaS_DEMO_CONFIGS[activeDemo].businessName,
  businessType: SaaS_DEMO_CONFIGS[activeDemo].businessType,
  tone: SaaS_DEMO_CONFIGS[activeDemo].tone,
  qualification: SaaS_DEMO_CONFIGS[activeDemo].qualificationQuestions.slice(0, 3).map(q => q.substring(0, 20) + "..."),
  handoff: SaaS_DEMO_CONFIGS[activeDemo].handoffCTA
}, null, 2)}
              </pre>
              <div className="mt-6 pt-6 border-t border-white/10 text-xs text-slate-400 italic">
                Active Config: {SaaS_DEMO_CONFIGS[activeDemo].businessName}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* The Reusable Concierge Widget (Multi-tenant ready) */}
      <ConciergeWidget 
        key={activeDemo} // Force re-render of widget when config changes
        config={SaaS_DEMO_CONFIGS[activeDemo]} 
      />
    </div>
  );
};

export default App;
