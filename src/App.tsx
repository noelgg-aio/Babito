import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import BottomNavigation from './components/BottomNavigation';
import TodayScreen from './screens/TodayScreen';
import StatsScreen from './screens/StatsScreen';
import SettingsScreen from './screens/SettingsScreen';
import AddHabitScreen from './screens/AddHabitScreen';
import EditHabitScreen from './screens/EditHabitScreen';
import CalendarScreen from './screens/CalendarScreen';
import { HabitProvider } from './contexts/HabitContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Add vibration feedback for touch
  const enableHapticFeedback = () => {
    document.addEventListener('click', (e) => {
      if (e.target instanceof HTMLButtonElement || 
          e.target instanceof HTMLAnchorElement ||
          e.target instanceof HTMLInputElement) {
        // Check if device supports vibration
        if (navigator.vibrate) {
          navigator.vibrate(10); // Short vibration
        }
      }
    });
  };

  useEffect(() => {
    enableHapticFeedback();
  }, []);

  return (
    <div className="mobile-container">
      <ThemeProvider>
        <HabitProvider>
          <Router>
            <div className="app-container h-full min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 transition-colors duration-200">
              <main className="flex-1 pb-16 pt-2 px-3 w-full bg-gray-50 dark:bg-gray-900">
                <Routes>
                  <Route path="/" element={<Navigate to="/today" replace />} />
                  <Route path="/today" element={<TodayScreen />} />
                  <Route path="/calendar" element={<CalendarScreen />} />
                  <Route path="/stats" element={<StatsScreen />} />
                  <Route path="/settings" element={<SettingsScreen />} />
                  <Route path="/add-habit" element={<AddHabitScreen />} />
                  <Route path="/edit-habit/:id" element={<EditHabitScreen />} />
                </Routes>
              </main>
              <BottomNavigation />
            </div>
          </Router>
        </HabitProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
