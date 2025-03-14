import { useState } from 'react';
import { Calendar, Flag, TrendingUp, Trophy } from 'lucide-react';
import { useHabits, Habit } from '../contexts/HabitContext';

const StatsScreen = () => {
  const { habits, getCompletionRate } = useHabits();
  const [timeframe, setTimeframe] = useState<number>(7); // 7, 30, or 90 days
  
  const getHabitWithLongestStreak = () => {
    if (habits.length === 0) return null;
    return habits.reduce((max, habit) => 
      habit.bestStreak > max.bestStreak ? habit : max, habits[0]);
  };
  
  const getMostConsistentHabit = () => {
    if (habits.length === 0) return null;
    
    let mostConsistent: Habit | null = null;
    let highestRate = 0;
    
    habits.forEach(habit => {
      const rate = getCompletionRate(habit.id, timeframe);
      if (rate > highestRate) {
        highestRate = rate;
        mostConsistent = habit;
      }
    });
    
    return mostConsistent;
  };
  
  const totalDaysTracked = () => {
    if (habits.length === 0) return 0;
    
    // Find the oldest habit creation date
    const oldestDate = new Date(Math.min(
      ...habits.map(h => new Date(h.createdAt).getTime())
    ));
    
    // Calculate days between oldest habit and today
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - oldestDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const longestStreakHabit = getHabitWithLongestStreak();
  const mostConsistentHabit = getMostConsistentHabit();
  
  return (
    <div className="scroll-container bg-gray-50 dark:bg-gray-900">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Statistics</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track your progress and stay motivated
        </p>
      </header>
      
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <button
            className={`px-3 py-1.5 rounded-full text-sm ${
              timeframe === 7 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setTimeframe(7)}
          >
            7 days
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm ${
              timeframe === 30 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setTimeframe(30)}
          >
            30 days
          </button>
          <button
            className={`px-3 py-1.5 rounded-full text-sm ${
              timeframe === 90 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
            onClick={() => setTimeframe(90)}
          >
            90 days
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-2">
            <Trophy className="text-yellow-500" size={18} />
            <h3 className="ml-2 font-semibold">Longest Streak</h3>
          </div>
          {longestStreakHabit ? (
            <>
              <p className="text-2xl font-bold">{longestStreakHabit.bestStreak} days</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                {longestStreakHabit.name}
              </p>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No data yet</p>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-2">
            <TrendingUp className="text-green-500" size={18} />
            <h3 className="ml-2 font-semibold">Most Consistent</h3>
          </div>
          {mostConsistentHabit ? (
            <>
              <p className="text-2xl font-bold">
                {getCompletionRate(mostConsistentHabit.id, timeframe)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                {mostConsistentHabit.name}
              </p>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No data yet</p>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-2">
            <Flag className="text-red-500" size={18} />
            <h3 className="ml-2 font-semibold">Total Habits</h3>
          </div>
          <p className="text-2xl font-bold">{habits.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Active habits
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-2">
            <Calendar className="text-blue-500" size={18} />
            <h3 className="ml-2 font-semibold">Days Tracked</h3>
          </div>
          <p className="text-2xl font-bold">{totalDaysTracked()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Since first habit
          </p>
        </div>
      </div>
      
      <h2 className="font-semibold text-lg mb-3">Completion Rates</h2>
      
      {habits.length > 0 ? (
        <div className="space-y-4">
          {habits.map(habit => {
            const completionRate = getCompletionRate(habit.id, timeframe);
            return (
              <div key={habit.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{habit.name}</h3>
                  <span className="text-sm font-semibold">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No habits to show statistics for
          </p>
        </div>
      )}
    </div>
  );
};

export default StatsScreen;
