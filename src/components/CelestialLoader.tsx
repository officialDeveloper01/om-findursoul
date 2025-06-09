
export const CelestialLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Spinning Sacred Geometry */}
      <div className="relative">
        {/* Outer ring */}
        <div className="w-20 h-20 border-4 border-amber-200 rounded-full animate-spin">
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-amber-500 rounded-full transform -translate-x-1/2 -translate-y-1"></div>
        </div>
        
        {/* Inner ring */}
        <div className="absolute inset-2 w-16 h-16 border-4 border-purple-200 rounded-full animate-spin animate-reverse">
          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-0.5"></div>
        </div>
        
        {/* Center dot */}
        <div className="absolute inset-6 w-8 h-8 bg-gradient-to-r from-amber-400 to-purple-400 rounded-full pulse-glow flex items-center justify-center">
          <span className="text-white text-xs font-bold">ॐ</span>
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-6 text-center">
        <p className="text-amber-600 text-lg font-medium">Calculating sacred numbers...</p>
        <p className="text-slate-500 text-sm mt-1">Channeling cosmic wisdom</p>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-amber-400 rounded-full animate-ping animation-delay-2000"></div>
      </div>
    </div>
  );
};
