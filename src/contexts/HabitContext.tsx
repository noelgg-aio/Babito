import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { format, parseISO, isToday, isSameDay, addDays, startOfDay } from 'date-fns';

export type Frequency = 'daily' | 'weekly' | 'custom';

export interface SelectedDays {
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
}

export interface Habit {
  id: string;
  name: string;
  frequency: Frequency;
  selectedDays: SelectedDays;
  reminderTime: string | null;
  createdAt: string;
  completedDates: string[]; // ISO date strings of completed dates
  streak: number;
  bestStreak: number;
  color: string;
}

export interface Log {
  date: string; // ISO date string
  habitId: string;
  completed: boolean;
}

interface HabitContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'streak' | 'bestStreak'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string, date: Date) => void;
  isHabitCompletedToday: (id: string) => boolean;
  shouldHabitBeCompletedToday: (habit: Habit) => boolean;
  todaysProgress: number;
  getActiveHabits: () => Habit[];
  getCompletionRate: (habitId: string, days: number) => number;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

export const HabitProvider = ({ children }: { children: ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const savedHabits = localStorage.getItem('habits');
    return savedHabits ? JSON.parse(savedHabits) : [];
  });

  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'streak' | 'bestStreak'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completedDates: [],
      streak: 0,
      bestStreak: 0,
    };
    setHabits((prevHabits) => [...prevHabits, newHabit]);
  };

  const updateHabit = (updatedHabit: Habit) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => (habit.id === updatedHabit.id ? updatedHabit : habit))
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
  };

  const shouldHabitBeCompletedToday = (habit: Habit) => {
    const today = new Date();
    const dayOfWeek = format(today, 'EEE').toLowerCase() as keyof SelectedDays;

    if (habit.frequency === 'daily') {
      return true;
    } else if (habit.frequency === 'weekly') {
      // For weekly habits, check if they were completed this week already
      const startOfWeek = addDays(startOfDay(today), -today.getDay()); // Start of current week (Sunday)
      const completedThisWeek = habit.completedDates.some(date => {
        const completedDate = parseISO(date);
        return completedDate >= startOfWeek && completedDate <= today;
      });
      return !completedThisWeek;
    } else if (habit.frequency === 'custom') {
      return habit.selectedDays[dayOfWeek];
    }
    return false;
  };

  const toggleHabitCompletion = (id: string, date: Date) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id !== id) return habit;

        const dateStr = date.toISOString();
        const isCompleted = habit.completedDates.some((d) => isSameDay(parseISO(d), date));

        let updatedCompletedDates;
        let updatedStreak = habit.streak;
        let updatedBestStreak = habit.bestStreak;

        if (isCompleted) {
          // If already completed, remove the date
          updatedCompletedDates = habit.completedDates.filter((d) => !isSameDay(parseISO(d), date));
          
          // Update streak if we're removing today's completion
          if (isToday(date)) {
            updatedStreak = 0;
          }
        } else {
          // If not completed, add the date
          updatedCompletedDates = [...habit.completedDates, dateStr];
          
          // Check if we're completing today's habit
          if (isToday(date)) {
            // Check if yesterday was completed
            const yesterday = addDays(new Date(), -1);
            const wasYesterdayCompleted = habit.completedDates.some(d => 
              isSameDay(parseISO(d), yesterday)
            );
            
            // Only increase streak if yesterday was completed or if this is the first completion
            if (wasYesterdayCompleted || habit.streak === 0) {
              updatedStreak = habit.streak + 1;
              
              // Update best streak if current streak is better
              if (updatedStreak > habit.bestStreak) {
                updatedBestStreak = updatedStreak;
              }
            }
          }
        }

        return {
          ...habit,
          completedDates: updatedCompletedDates,
          streak: updatedStreak,
          bestStreak: updatedBestStreak,
        };
      })
    );
  };

  const isHabitCompletedToday = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return false;

    return habit.completedDates.some((date) => isToday(parseISO(date)));
  };

  const getActiveHabits = () => {
    return habits.filter(habit => shouldHabitBeCompletedToday(habit));
  };

  const todaysProgress = () => {
    const activeHabits = getActiveHabits();
    if (activeHabits.length === 0) return 0;
    
    const completedHabits = activeHabits.filter(habit => 
      habit.completedDates.some(date => isToday(parseISO(date)))
    );
    
    return Math.round((completedHabits.length / activeHabits.length) * 100);
  };

  const getCompletionRate = (habitId: string, days: number) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;
    
    let daysToCheck = days;
    let completedCount = 0;
    const today = new Date();
    
    // Count how many days the habit should have been completed
    let totalDays = 0;
    
    for (let i = 0; i < daysToCheck; i++) {
      const checkDate = addDays(today, -i);
      
      // Check if the habit should be completed on this day based on frequency
      const shouldComplete = (() => {
        if (habit.frequency === 'daily') return true;
        
        if (habit.frequency === 'weekly') {
          // For weekly, only check one day per week
          return i % 7 === 0;
        }
        
        if (habit.frequency === 'custom') {
          const dayOfWeek = format(checkDate, 'EEE').toLowerCase() as keyof SelectedDays;
          return habit.selectedDays[dayOfWeek];
        }
        
        return false;
      })();
      
      if (shouldComplete) {
        totalDays++;
        
        // Check if it was completed
        const wasCompleted = habit.completedDates.some(date => 
          isSameDay(parseISO(date), checkDate)
        );
        
        if (wasCompleted) {
          completedCount++;
        }
      }
    }
    
    return totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;
  };

  const value = {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    isHabitCompletedToday,
    shouldHabitBeCompletedToday,
    todaysProgress: todaysProgress(),
    getActiveHabits,
    getCompletionRate,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};
