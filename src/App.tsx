import { useState } from 'react';
import { Timer } from './components/Timer';
import { Plus } from 'lucide-react';

function App() {
  const [timers, setTimers] = useState<string[]>(['initial']);

  const addTimer = () => {
    setTimers([...timers, Date.now().toString()]);
  };

  const deleteTimer = (id: string) => {
    setTimers(timers.filter(timerId => timerId !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">Online Timer</h1>
        </div>
      </header>
      
      <main className="w-full max-w-4xl mx-auto px-1 sm:px-4 py-4 sm:py-12 flex-grow">
        <div className="space-y-6 sm:space-y-10">
          {timers.map(id => (
            <Timer key={id} id={id} onDelete={deleteTimer} />
          ))}
          
          <button
            onClick={addTimer}
            className="w-full py-4 sm:py-6 border-2 border-dashed border-teal-300 hover:border-teal-400 rounded-xl text-teal-600 hover:text-teal-700 transition-colors flex items-center justify-center gap-2 group text-base sm:text-lg"
          >
            <Plus size={20} className="sm:size-24 group-hover:scale-110 transition-transform" />
            <span>Add another timer</span>
          </button>
        </div>
      </main>
      
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-3xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <p className="text-center text-gray-500 text-xs sm:text-sm">
            © 2007-2025 Online Timer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;