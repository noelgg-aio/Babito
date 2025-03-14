import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHabits, Frequency, SelectedDays } from '../contexts/HabitContext';

const colorOptions = [
  '#4f46e5', // indigo
  '#10b981', // green  
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
];

const AddHabitScreen = () => {
  const navigate = useNavigate();
  const { addHabit } = useHabits();
  
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [selectedDays, setSelectedDays] = useState<SelectedDays>({
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: true,
    sun: true,
  });
  const [reminderTime, setReminderTime] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  
  const handleToggleDay = (day: keyof SelectedDays) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter a habit name');
      return;
    }
    
    addHabit({
      name: name.trim(),
      frequency,
      selectedDays,
      reminderTime,
      color: selectedColor,
    });
    
    navigate('/today');
  };
  
  return (
    <div className="scroll-container pb-4">
      <header className="mb-4 flex items-center">
        <button
          className="mr-2 p-1.5 -ml-1.5 active-feedback rounded-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Create New Habit</h1>
      </header>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="habitName" className="block text-sm font-medium mb-1.5">
            Habit Name
          </label>
          <input
            type="text"
            id="habitName"
            placeholder="e.g., Drink water, Meditate..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            autoFocus
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1.5">Color</label>
          <div className="flex gap-2">
            {colorOptions.map(color => (
              <button
                key={color}
                type="button"
                className={`w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  selectedColor === color ? 'ring-2 ring-offset-2 dark:ring-offset-gray-900' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1.5">
            Frequency
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              className={`px-3 py-2.5 rounded-lg text-center text-sm ${
                frequency === 'daily' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => setFrequency('daily')}
            >
              Daily
            </button>
            <button
              type="button"
              className={`px-3 py-2.5 rounded-lg text-center text-sm ${
                frequency === 'weekly' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => setFrequency('weekly')}
            >
              Weekly
            </button>
            <button
              type="button"
              className={`px-3 py-2.5 rounded-lg text-center text-sm ${
                frequency === 'custom' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
              onClick={() => setFrequency('custom')}
            >
              Custom
            </button>
          </div>
        </div>
        
        {/* Custom day selector */}
        {frequency === 'custom' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5">
              Select Days
            </label>
            <div className="day-selector">
              {(Object.keys(selectedDays) as Array<keyof SelectedDays>).map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`${selectedDays[day] ? 'selected' : 'bg-gray-100 dark:bg-gray-700'}`}
                  onClick={() => handleToggleDay(day)}
                >
                  {day.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1.5">
            Reminder Time (Optional)
          </label>
          <input
            type="time"
            value={reminderTime || ''}
            onChange={(e) => setReminderTime(e.target.value || null)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
            Note: Web notifications will only work when the app is open
          </p>
        </div>
        
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-base"
        >
          Create Habit
        </button>
      </form>
    </div>
  );
};

export default AddHabitScreen;
