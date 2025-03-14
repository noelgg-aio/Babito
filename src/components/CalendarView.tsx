import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameDay, parseISO } from 'date-fns';
import { useHabits, Habit } from '../contexts/HabitContext';
import { useNavigate } from 'react-router-dom';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarViewProps {
  onDateSelect?: (date: Date) => void;
}

const CalendarView = ({ onDateSelect }: CalendarViewProps) => {
  const [value, setValue] = useState<Value>(new Date());
  const [habitCompletionMap, setHabitCompletionMap] = useState<Record<string, {total: number, completed: number}>>({});
  const { habits } = useHabits();
  const navigate = useNavigate();

  // Build a map of dates to habit completion status
  useEffect(() => {
    const dateMap: Record<string, {total: number, completed: number}> = {};
    
    habits.forEach(habit => {
      // Check each habit's frequency and completions
      const completedDates = habit.completedDates.map(date => format(parseISO(date), 'yyyy-MM-dd'));
      
      // Add all completed dates to the map
      completedDates.forEach(dateStr => {
        if (!dateMap[dateStr]) {
          dateMap[dateStr] = { total: 0, completed: 0 };
        }
        dateMap[dateStr].completed += 1;
        dateMap[dateStr].total += 1;
      });
      
      // TODO: For a more complete implementation, we would need to track which habits should
      // have been completed on each day based on their frequency settings
    });
    
    setHabitCompletionMap(dateMap);
  }, [habits]);

  const handleDateChange = (newValue: Value) => {
    setValue(newValue);
    if (newValue instanceof Date) {
      if (onDateSelect) {
        onDateSelect(newValue);
      }
    }
  };

  // Custom tile content to show habit completion status
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const dateString = format(date, 'yyyy-MM-dd');
    const dateData = habitCompletionMap[dateString];
    
    if (!dateData || dateData.completed === 0) return null;
    
    const percentage = Math.round((dateData.completed / dateData.total) * 100);
    const isComplete = dateData.completed === dateData.total;
    
    return (
      <div className="flex justify-center mt-1">
        <div 
          className={`h-2 w-2 rounded-full ${
            isComplete ? 'bg-green-500' : 'bg-amber-500'
          }`}
        />
      </div>
    );
  };

  // Custom class name for tiles
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';
    
    // Highlight today
    if (isSameDay(date, new Date())) {
      return 'bg-indigo-100 dark:bg-indigo-900/30 font-bold';
    }
    
    return '';
  };

  return (
    <div className="calendar-container mb-4">
      <style>
        {`
          /* Override calendar styles to match app theme */
          .react-calendar {
            width: 100%;
            border: none;
            border-radius: 12px;
            background-color: white;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .dark .react-calendar {
            background-color: #1f2937;
            color: white;
          }
          
          .react-calendar__tile {
            padding: 8px 4px;
            position: relative;
            border-radius: 8px;
            min-height: 40px;
            font-size: 13px;
          }
          
          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background-color: #f3f4f6;
          }
          
          .dark .react-calendar__tile:enabled:hover,
          .dark .react-calendar__tile:enabled:focus {
            background-color: #374151;
          }
          
          .react-calendar__tile--now {
            background: #ede9fe;
          }
          
          .dark .react-calendar__tile--now {
            background: rgba(79, 70, 229, 0.2);
          }
          
          .react-calendar__tile--active {
            background: #4f46e5 !important;
            color: white;
          }
          
          .react-calendar__tile--active:enabled:hover,
          .react-calendar__tile--active:enabled:focus {
            background: #4338ca !important;
          }
          
          .react-calendar__navigation button {
            min-width: 40px;
            background: none;
            font-size: 14px;
            margin-top: 8px;
            min-height: 40px;
          }
          
          .react-calendar__navigation button:disabled {
            background-color: transparent;
          }
          
          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background-color: #f3f4f6;
            border-radius: 8px;
          }
          
          .dark .react-calendar__navigation button:enabled:hover,
          .dark .react-calendar__navigation button:enabled:focus {
            background-color: #374151;
          }
          
          .react-calendar__month-view__weekdays {
            text-align: center;
            text-transform: uppercase;
            font-weight: 500;
            font-size: 0.65rem;
          }
          
          .react-calendar__month-view__weekdays__weekday {
            padding: 0.4rem;
          }
          
          .react-calendar__month-view__weekdays__weekday abbr {
            text-decoration: none;
          }
          
          .dark .react-calendar__month-view__weekdays__weekday {
            color: #9ca3af;
          }
          
          /* Mobile optimized styles */
          .react-calendar__navigation {
            padding: 4px 0;
          }
          
          .react-calendar__navigation__label {
            font-weight: bold;
            font-size: 14px;
          }
          
          .react-calendar__month-view__days__day--neighboringMonth {
            opacity: 0.4;
          }
        `}
      </style>
      <Calendar 
        onChange={handleDateChange}
        value={value}
        tileContent={tileContent}
        tileClassName={tileClassName}
        className="dark:text-white dark:bg-gray-800"
      />
    </div>
  );
};

export default CalendarView;
