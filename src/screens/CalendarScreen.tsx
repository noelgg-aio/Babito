import { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { useHabits } from '../contexts/HabitContext';
import CalendarView from '../components/CalendarView';
import HabitCard from '../components/HabitCard';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { habits, shouldHabitBeCompletedToday } = useHabits();
  
  // Filter habits based on selected date
  const getHabitsForDate = (date: Date) => {
    return habits.filter(habit => {
      // For today, use the active habits logic
      if (isSameDay(date, new Date())) {
        return shouldHabitBeCompletedToday(habit);
      }
      
      // For past dates, we'll show all habits that could have been completed on that day
      // This is simplified - a more complete implementation would check the habit frequency for that specific date
      return true;
    });
  };
  
  const habitsForSelectedDate = getHabitsForDate(selectedDate);
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  return (
    <div className="scroll-container pb-4 bg-gray-50 dark:bg-gray-900">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track your habits over time
        </p>
      </header>
      
      <CalendarView onDateSelect={handleDateSelect} />
      
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <span>
              {isSameDay(selectedDate, new Date()) 
                ? "Today's Habits" 
                : `Habits for ${format(selectedDate, 'MMMM d, yyyy')}`}
            </span>
          </h2>
          
          {!isSameDay(selectedDate, new Date()) && (
            <button
              onClick={() => setSelectedDate(new Date())}
              className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full"
            >
              Today
            </button>
          )}
        </div>
        
        {habitsForSelectedDate.length > 0 ? (
          <div>
            {habitsForSelectedDate.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="text-gray-500 dark:text-gray-400">
              No habits for {isSameDay(selectedDate, new Date()) ? "today" : "this date"}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {isSameDay(selectedDate, new Date()) 
                ? "Add habits in the Today tab" 
                : "Select a different date or add more habits"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarScreen;
