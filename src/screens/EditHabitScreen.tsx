import { useState, useEffect } from 'react';
import { Squircle, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHabits, Frequency, SelectedDays } from '../contexts/HabitContext';

const colorOptions = [
  '#4f46e5', // indigo
  '#10b981', // green  
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
];

const EditHabitScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { habits, updateHabit } = useHabits();
  
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
  const [notFound, setNotFound] = useState(false);
  
  // Load habit data
  useEffect(() => {
    const habitToEdit = habits.find(habit => habit.id === id);
    
    if (habitToEdit) {
      setName(habitToEdit.name);
      setFrequency(habitToEdit.frequency);
      setSelectedDays(habitToEdit.selectedDays);
      setReminderTime(habitToEdit.reminderTime);
      setSelectedColor(habitToEdit.color);
    } else {
      setNotFound(true);
    }
  }, [id, habits]);
  
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
    
    const habitToUpdate = habits.find(habit => habit.id === id);
    
    if (!habitToUpdate) {
      alert('Habit not found');
      return;
    }
    
    updateHabit({
      ...habitToUpdate,
      name: name.trim(),
      frequency,
      selectedDays,
      reminderTime,
      color: selectedColor,
    });
    
    navigate('/today');
  };
  
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Squircle size={48} className="text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Habit Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          The habit you're trying to edit doesn't exist
        </p>
        <button
          onClick={() => navigate('/today')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="scroll-container pb-6">
      <header className="mb-6 flex items-center">
        <button
          className="mr-3 p-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold">Edit Habit</h1>
      </header>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="habitName" className="block text-sm font-medium mb-1">
            Habit Name
          </label>
          <input
            type="text"
            id="habitName"
            placeholder="e.g., Drink water, Meditate..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">Color</label>
          <div className="flex gap-3">
            {colorOptions.map(color => (
              <button
                key={color}
                type="button"
                className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  selectedColor === color ? 'ring-2 ring-offset-2 dark:ring-offset-gray-900' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-medium mb-2">
            Frequency
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg text-center ${
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
              className={`px-4 py-2 rounded-lg text-center ${
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
              className={`px-4 py-2 rounded-lg text-center ${
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
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">
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
        
        <div className="mb-8">
          <label className="block text-sm font-medium mb-1">
            Reminder Time (Optional)
          </label>
          <input
            type="time"
            value={reminderTime || ''}
            onChange={(e) => setReminderTime(e.target.value || null)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Note: Web notifications will only work when the app is open
          </p>
        </div>
        
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditHabitScreen;
