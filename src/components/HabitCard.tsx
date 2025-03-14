import { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { Habit, useHabits } from '../contexts/HabitContext';

interface HabitCardProps {
  habit: Habit;
}

const HabitCard = ({ habit }: HabitCardProps) => {
  const navigate = useNavigate();
  const { toggleHabitCompletion, isHabitCompletedToday } = useHabits();
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<{ id: number; color: string; left: string }[]>([]);
  const [swiping, setSwiping] = useState(false);
  
  const isCompleted = isHabitCompletedToday(habit.id);
  
  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If we're marking as complete, show celebration animation
    if (!isCompleted) {
      // Create confetti pieces with random positions
      const pieces = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        color: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
        left: `${Math.random() * 100}%`
      }));
      
      setConfettiPieces(pieces);
      setShowConfetti(true);
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([15, 10, 15]);
      }
      
      // Remove confetti after animation completes
      setTimeout(() => {
        setShowConfetti(false);
      }, 1000);
    }
    
    toggleHabitCompletion(habit.id, new Date());
  };
  
  const handleNavigateToEdit = () => {
    navigate(`/edit-habit/${habit.id}`);
  };
  
  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwiping: () => setSwiping(true),
    onSwipedLeft: () => {
      handleNavigateToEdit();
      setSwiping(false);
    },
    onSwiped: () => setSwiping(false),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
    trackTouch: true,
    delta: 10
  });
  
  return (
    <div 
      className={`habit-card mb-3 shadow-sm relative overflow-hidden ${
        isCompleted ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'
      } ${swiping ? 'opacity-95' : ''}`}
      {...swipeHandlers}
    >
      {/* Confetti animation container */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confettiPieces.map(piece => (
            <div 
              key={piece.id}
              className="confetti absolute bottom-0 w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: piece.color, 
                left: piece.left,
                animationDelay: `${Math.random() * 0.2}s`
              }}
            />
          ))}
        </div>
      )}
      
      <div 
        className="flex items-center py-3 px-4"
        onClick={handleNavigateToEdit}
      >
        <button
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            isCompleted 
              ? 'bg-green-500 text-white check-bounce' 
              : 'border-2 border-gray-300 dark:border-gray-500'
          }`}
          onClick={handleToggleComplete}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {isCompleted && <Check size={16} />}
        </button>
        
        <div className="ml-3 flex-1">
          <h3 className={`font-medium text-base ${isCompleted ? 'text-gray-500 line-through dark:text-gray-400' : ''}`}>
            {habit.name}
          </h3>
          <div className="flex items-center mt-0.5">
            {habit.streak > 0 && (
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 py-0.5 px-2 rounded-full streak-badge">
                {habit.streak} day streak 🔥
              </span>
            )}
          </div>
        </div>
        
        <div className="ml-1 pl-1 h-full flex items-center">
          <ChevronRight size={18} className="text-gray-400" />
        </div>
      </div>
      
      {/* Swipe indicator hint */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-10">
        <div className="w-1 h-16 bg-gray-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default HabitCard;
