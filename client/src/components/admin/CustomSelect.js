import React from "react";

export const CustomSelect = ({ options, value, onChange, placeholder, className = "" }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const selectRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value);

    return (
        <div ref={selectRef} className={`relative ${className}`}>
            <div
                className="w-full px-4 py-3 min-h-[48px] rounded-2xl border bg-[#0f172a]/40 border-white/5 text-slate-100 font-bold cursor-pointer flex justify-between items-center transition-all hover:bg-[#0f172a]/60 hover:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate flex-grow min-w-0 text-left text-sm">{selectedOption ? selectedOption.label : placeholder}</span>
                <svg className={`shrink-0 ml-2 w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-[1001] w-full mt-2 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-blue-500/30 backdrop-blur-xl">
                    <div className="max-h-[320px] overflow-y-auto overflow-x-hidden dropdown-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 rgba(15, 23, 42, 0.5)' }}>
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`px-4 py-3 cursor-pointer transition-all flex items-center justify-between group border-l-4 ${value === option.value
                                    ? 'bg-blue-600/20 text-blue-400 border-blue-500'
                                    : 'text-slate-300 hover:bg-white/5 hover:text-white border-transparent hover:border-white/10'
                                    }`}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                <div className="flex flex-col">
                                    <span className={`font-semibold text-sm transition-colors ${value === option.value ? 'text-blue-400' : 'text-slate-200 group-hover:text-white'}`}>
                                        {option.label}
                                    </span>
                                </div>
                                {value === option.value && (
                                    <div className="bg-blue-500/20 p-1 rounded-full shadow-lg shadow-blue-500/20">
                                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {options.length > 5 && (
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none rounded-b-xl" />
                    )}
                </div>
            )}
        </div>
    );
};