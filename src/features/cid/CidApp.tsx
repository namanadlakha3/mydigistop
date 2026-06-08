import { useState } from 'react';
import { CidGenerator } from './components/CidGenerator';
import { KeyChecker } from './components/KeyChecker';
import { O365Checker } from './components/O365Checker';

export function CidApp() {
  const [activeTab, setActiveTab] = useState<'cid' | 'key' | 'o365'>('cid');

  return (
    <div className="min-h-screen bg-[#0A0D1E] text-white flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Global Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1/2 bg-[#6C47FF]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header / Tabs */}
      <div className="relative z-10 w-full max-w-2xl mb-8 flex flex-col items-center">
        <h1 className="text-3xl font-black mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          Digital Tools
        </h1>

        <div className="bg-[#12152A] border border-white/10 rounded-xl p-1.5 flex items-center gap-1 w-full sm:w-auto shadow-2xl">
          <button
            onClick={() => setActiveTab('cid')}
            className={`flex-1 sm:w-48 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'cid'
                ? 'bg-[#6C47FF] text-white shadow-lg shadow-[#6C47FF]/25'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            CID Generator
          </button>
          <button
            onClick={() => setActiveTab('key')}
            className={`flex-1 sm:w-32 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'key'
                ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/25'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            Key Checker
          </button>
          <button
            onClick={() => setActiveTab('o365')}
            className={`flex-1 sm:w-32 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'o365'
                ? 'bg-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/25'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            O365 Checker
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl w-full bg-[#12152A] rounded-2xl p-6 sm:p-8 border border-white/5 shadow-2xl relative overflow-hidden z-10">
        {/* Subtle inner glow based on active tab */}
        <div 
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-[60px] rounded-full pointer-events-none transition-colors duration-700 ${
            activeTab === 'cid' ? 'bg-[#6C47FF]/10' : 
            activeTab === 'key' ? 'bg-[#10B981]/10' : 'bg-[#0EA5E9]/10'
          }`} 
        />
        
        <div className="relative z-20">
          {activeTab === 'cid' && <CidGenerator />}
          {activeTab === 'key' && <KeyChecker />}
          {activeTab === 'o365' && <O365Checker />}
        </div>
      </div>
    </div>
  );
}
