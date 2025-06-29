import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const WeightDropdown = ({ weightOptions, selectedWeight, onSelect, showPrice = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((v) => !v)}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border rounded-lg shadow-sm transition-all duration-200
          ${isOpen ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-white'}
        `}
      >
        <span>{selectedWeight?.weight || selectedWeight || 'Select Weight'}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 min-w-[200px]">
          <div className="py-2">
            {weightOptions && weightOptions.length > 0 ? (
              weightOptions.map((option) => (
                <button
                  key={option.weight}
                  onClick={() => {
                    onSelect(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0
                    ${selectedWeight?.weight === option.weight || selectedWeight === option.weight
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-gray-700'
                    }`}
                >
                  <div>
                    <div className="font-medium">{option.weight}</div>
                    <div className="text-xs text-gray-500">{option.display}</div>
                  </div>
                  {showPrice && (
                    <div className="text-sm font-semibold text-orange-600">
                      ₹{parseFloat(option.price).toFixed(0)}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No weight options available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightDropdown; 