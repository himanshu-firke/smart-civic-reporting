import React from 'react';

const STAGES = [
  { id: "Submitted", label: "Submitted" },
  { id: "Assigned", label: "Assigned" },
  { id: "InProgress", label: "In Progress" },
  { id: "Resolved", label: "Resolved" },
  { id: "Closed", label: "Closed" },
];

export function StatusTimeline({ currentStatus }) {
  // Determine index of current status
  let currentIndex = STAGES.findIndex(s => s.id === currentStatus);
  if (currentIndex === -1) currentIndex = 0; // Default fallback

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between w-full">
        
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
        
        {/* Active Progress Line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-500 rounded-full z-0 transition-all duration-500 ease-out"
          style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
        ></div>

        {/* Nodes */}
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isPending = index > currentIndex;

          let nodeClasses = "";
          let textClasses = "";

          if (isCompleted) {
             nodeClasses = "bg-indigo-600 border-indigo-600 text-white";
             textClasses = "text-indigo-700 font-bold";
          } else if (isActive) {
             nodeClasses = "bg-white border-indigo-600 border-4 text-indigo-600 shadow-[0_0_0_4px_rgba(79,70,229,0.2)]";
             textClasses = "text-indigo-800 font-black";
          } else if (isPending) {
             nodeClasses = "bg-white border-gray-300 text-gray-300";
             textClasses = "text-gray-400 font-medium";
          }

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center">
              {/* Circle */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${nodeClasses}`}>
                 {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                 ) : isActive ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></div>
                 ) : (
                    <span className="text-[10px] font-bold">{index + 1}</span>
                 )}
              </div>
              
              {/* Label */}
              <div className={`absolute top-10 text-[10px] sm:text-xs text-center w-24 -ml-8 tracking-wide transition-all duration-300 ${textClasses}`}>
                {stage.label}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
