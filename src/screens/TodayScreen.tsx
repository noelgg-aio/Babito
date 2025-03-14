import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, isSameDay } from 'date-fns';
import { useHabits } from '../contexts/HabitContext';
import HabitCard from '../components/HabitCard';
import ProgressCircle from '../components/ProgressCircle';

const TodayScreen = () => {
  const navigate = useNavigate();
  const { getActiveHabits, todaysProgress, habits, isHabitCompletedToday, shouldHabitBeCompletedToday } = useHabits();
  
  const activeHabits = getActiveHabits();
  
  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    if (activeHabits.length === 0) {
      return "Add your first habit to get started!";
    }
    if (todaysProgress === 100) {
      return "Amazing job! You've completed all your habits today! 🎉";
    }
    if (todaysProgress > 50) {
      return "You're making great progress today! Keep it up!";
    }
    return "You've got this! Take one habit at a time.";
  };
  
  return (
    <div className="scroll-container pb-2 bg-gray-50 dark:bg-gray-900">
      <header className="mb-4">
        <h1 className="text-xl font-bold">Today</h1>
        <div className="flex justify-between items-center mt-1">
          <button 
            onClick={() => navigate('/calendar')} 
            className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm"
          >
            {format(new Date(), 'EEEE, MMMM d')}
          </button>
        </div>
      </header>
      
      {activeHabits.length > 0 ? (
        <div className="mb-4 flex flex-col items-center">
          <ProgressCircle percentage={todaysProgress} size={110} strokeWidth={8} />
          <p className="text-center mt-3 text-gray-600 dark:text-gray-300 text-sm">
            {getMotivationalMessage()}
          </p>
        </div>
      ) : (
        <div className="my-6 text-center">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-4 mb-4">
            <h3 className="font-medium text-base">Welcome to Habit Tracker!</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
              Add your first habit to start building better routines.
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Your Habits</h2>
          <button
            onClick={() => navigate('/add-habit')}
            className="bg-indigo-600 text-white p-2 rounded-full shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
        
        {activeHabits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
        
        {activeHabits.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No habits for today. Add one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayScreen;
