import { useState } from 'react';
import { Moon, Sun, Trash2 } from 'lucide-react';
import { useHabits } from '../contexts/HabitContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

const SettingsScreen = () => {
  const { habits, deleteHabit } = useHabits();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  
  const handleDeleteHabit = (id: string) => {
    setHabitToDelete(id);
    setShowConfirmation(true);
  };
  
  const confirmDelete = () => {
    if (habitToDelete) {
      deleteHabit(habitToDelete);
      setShowConfirmation(false);
      setHabitToDelete(null);
    }
  };
  
  return (
    <div className="scroll-container bg-gray-50 dark:bg-gray-900">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Customize your experience
        </p>
      </header>
      
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Appearance</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <button 
            className="w-full py-4 px-5 flex items-center justify-between"
            onClick={toggleTheme}
          >
            <div className="flex items-center">
              {theme === 'dark' ? (
                <Moon size={20} className="text-indigo-500" />
              ) : (
                <Sun size={20} className="text-yellow-500" />
              )}
              <span className="ml-3">Dark Mode</span>
            </div>
            <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full relative">
              <div 
                className={`absolute w-5 h-5 rounded-full top-0.5 transition-transform ${
                  theme === 'dark' 
                    ? 'bg-indigo-600 translate-x-6' 
                    : 'bg-gray-400 translate-x-0.5'
                }`} 
              />
            </div>
          </button>
        </div>
      </section>
      
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Manage Habits</h2>
          <button
            onClick={() => navigate('/add-habit')}
            className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-full"
          >
            Add New
          </button>
        </div>
        
        {habits.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y divide-gray-100 dark:divide-gray-700">
            {habits.map(habit => (
              <div key={habit.id} className="py-3 px-5 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{habit.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {habit.frequency === 'daily' ? 'Daily' : 
                     habit.frequency === 'weekly' ? 'Weekly' : 'Custom days'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    onClick={() => handleDeleteHabit(habit.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                    onClick={() => navigate(`/edit-habit/${habit.id}`)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="text-gray-500 dark:text-gray-400">
              No habits created yet
            </p>
          </div>
        )}
      </section>
      
      {/* Delete confirmation modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 max-w-sm w-full">
            <h3 className="font-semibold text-lg mb-2">Delete Habit</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete this habit? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 text-gray-700 dark:text-gray-300"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;
