import React from 'react';
import { Zap, Eraser, Settings, HelpCircle } from 'lucide-react';

export default function Popup() {
  const handleAutoFill = () => {
    if (chrome && chrome.runtime) {
      chrome.runtime.sendMessage({ action: 'trigger_autofill' });
      window.close();
    } else {
      console.log('AutoFill Triggered (Dev Mode)');
    }
  };

  const handleAutoClear = () => {
    if (chrome && chrome.runtime) {
      chrome.runtime.sendMessage({ action: 'trigger_autoclear' });
      window.close();
    } else {
      console.log('AutoClear Triggered (Dev Mode)');
    }
  };

  const openOptions = () => {
    if (chrome && chrome.runtime) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('../options.html', '_blank');
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-white w-full">
      <div className="text-center">
        <h2 className="text-[22px] font-extrabold text-primary-600 tracking-tight leading-none">AutoFiller</h2>
        <p className="text-[13px] font-semibold text-gray-500 mt-0.5">Quick Actions</p>
      </div>

      <button 
        onClick={handleAutoFill}
        className="flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
      >
        <Zap size={18} className="fill-white" />
        AutoFill Now
      </button>

      <button 
        onClick={handleAutoClear}
        className="flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-danger-500 hover:bg-danger-600 text-white rounded-xl font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
      >
        <Eraser size={18} />
        Auto Clear
      </button>

      <hr className="border-gray-100 my-1" />

      <div className="flex flex-row gap-2">
        <button 
          onClick={openOptions}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 rounded-lg font-bold transition-all hover:-translate-y-px cursor-pointer shadow-sm"
        >
          <Settings size={16} className="text-gray-600" />
          Settings
        </button>
        <a 
          href="../help.html" 
          target="_blank" 
          title="Help & Docs"
          className="flex items-center justify-center p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all hover:-translate-y-px shadow-sm cursor-pointer"
        >
          <HelpCircle size={18} />
        </a>
      </div>
    </div>
  );
}
