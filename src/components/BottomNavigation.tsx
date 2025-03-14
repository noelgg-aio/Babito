import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, ChartBar, House, Settings } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 bottom-nav">
      <div className="flex items-center justify-around h-full">
        <button
          onClick={() => navigate('/today')}
          className={`flex flex-col items-center justify-center w-1/4 py-1 transition-colors active-feedback ${
            isActive('/today') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'
          }`}
        >
          <House size={20} />
          <span className="text-[10px] mt-0.5">Today</span>
        </button>
        <button
          onClick={() => navigate('/calendar')}
          className={`flex flex-col items-center justify-center w-1/4 py-1 transition-colors active-feedback ${
            isActive('/calendar') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'
          }`}
        >
          <Calendar size={20} />
          <span className="text-[10px] mt-0.5">Calendar</span>
        </button>
        <button
          onClick={() => navigate('/stats')}
          className={`flex flex-col items-center justify-center w-1/4 py-1 transition-colors active-feedback ${
            isActive('/stats') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'
          }`}
        >
          <ChartBar size={20} />
          <span className="text-[10px] mt-0.5">Stats</span>
        </button>
        <button
          onClick={() => navigate('/settings')}
          className={`flex flex-col items-center justify-center w-1/4 py-1 transition-colors active-feedback ${
            isActive('/settings') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'
          }`}
        >
          <Settings size={20} />
          <span className="text-[10px] mt-0.5">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
