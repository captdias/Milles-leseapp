import React, { useState, useEffect } from 'react';
import { 
  BadgeDef, GeneratedText, LevelInfo, ScreenId, SessionRecord, UserSettings 
} from './types';
import { 
  BADGE_DEFINITIONS, calculateSessionsThisWeek, calculateStreak, 
  getLevelForPoints, getNextLevel, getWeekDaysStatus, hasCompletedToday, 
  loadPraise, loadPoints, loadSessions, loadSettings, 
  savePraise, savePoints, saveSessions, saveSettings 
} from './utils/storage';
import { sound } from './utils/audio';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { SetupScreen } from './components/SetupScreen';
import { ReadingScreen } from './components/ReadingScreen';
import { MarkingScreen } from './components/MarkingScreen';
import { ModelReadingScreen } from './components/ModelReadingScreen';
import { PacingScreen } from './components/PacingScreen';
import { ResultScreen } from './components/ResultScreen';
import { BadgesScreen } from './components/BadgesScreen';
import { StatsScreen } from './components/StatsScreen';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  // Navigation
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // User State
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [praise, setPraise] = useState<string>('');
  const [settings, setSettings] = useState<UserSettings>(loadSettings());

  // Active Session State
  const [activeText, setActiveText] = useState<GeneratedText | null>(null);
  const [activeRound, setActiveRound] = useState<1 | 2>(1);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(60);
  const [round1Wpm, setRound1Wpm] = useState<number>(0);
  const [round2Wpm, setRound2Wpm] = useState<number>(0);

  // Initialize data on mount
  useEffect(() => {
    try {
      const loadedSessions = loadSessions();
      const loadedPoints = loadPoints();
      const loadedPraise = loadPraise();
      const loadedSettings = loadSettings();

      setSessions(loadedSessions);
      setPoints(loadedPoints);
      setPraise(loadedPraise);
      setSettings(loadedSettings);
      sound.enabled = loadedSettings.soundEnabled;
    } catch (err) {
      console.error('Error initializing App data:', err);
    }
  }, []);

  const refreshData = () => {
    setSessions(loadSessions());
    setPoints(loadPoints());
    setPraise(loadPraise());
    setSettings(loadSettings());
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Flow handlers
  const handleStartRound = (textData: GeneratedText) => {
    setActiveText(textData);
    setActiveRound(1);
    setRound1Wpm(0);
    setRound2Wpm(0);
    setElapsedSeconds(60);
    setCurrentScreen('read');
  };

  const handleFinishReading = (seconds: number) => {
    setElapsedSeconds(seconds);
    setCurrentScreen('mark');
  };

  const handleConfirmWordCount = (count: number, wpm: number) => {
    if (activeRound === 1) {
      setRound1Wpm(wpm);
      setCurrentScreen('model');
    } else {
      setRound2Wpm(wpm);
      setCurrentScreen('result');
    }
  };

  const handleProceedToPacer = () => {
    setCurrentScreen('pace');
  };

  const handleProceedToRound2 = () => {
    setActiveRound(2);
    setElapsedSeconds(60);
    setCurrentScreen('read');
  };

  const handleFinishSession = (sessionResult: {
    pointsEarned: number;
    praiseText: string;
    rating: number;
  }) => {
    if (!activeText) return;

    const newRecord: SessionRecord = {
      id: 'session_' + Date.now(),
      date: new Date().toISOString(),
      title: activeText.title,
      type: activeText.type,
      topic: activeText.topic,
      target: activeText.targetWords,
      r1: round1Wpm,
      r2: round2Wpm,
      points: sessionResult.pointsEarned,
      diff: round2Wpm - round1Wpm,
      rating: sessionResult.rating
    };

    const nextSessions = [...sessions, newRecord];
    const nextPoints = points + sessionResult.pointsEarned;

    setSessions(nextSessions);
    setPoints(nextPoints);
    setPraise(sessionResult.praiseText);

    saveSessions(nextSessions);
    savePoints(nextPoints);
    savePraise(sessionResult.praiseText);

    setCurrentScreen('home');
  };

  const handleRestartNewText = () => {
    setActiveText(null);
    setCurrentScreen('setup');
  };

  // Calculated properties
  const currentLevel = getLevelForPoints(points);
  const nextLevel = getNextLevel(points);
  const weekSessions = calculateSessionsThisWeek(sessions);
  const streak = calculateStreak(sessions);
  const completedToday = hasCompletedToday(sessions);
  const weekDays = getWeekDaysStatus(sessions);

  const currentTheme = settings.theme || 'nordic';
  const userName = settings.userName?.trim() || 'Mille';

  // Theme page background
  const pageBackground = {
    nordic: 'bg-[#FAF7F2] text-[#2C241E] selection:bg-[#EAE0D0]',
    sunshine: 'bg-gradient-to-b from-rose-50/70 via-amber-50/30 to-teal-50/30 text-slate-800 selection:bg-pink-200',
    evening: 'bg-[#121622] text-[#E4E9F2] selection:bg-indigo-900'
  }[currentTheme];

  return (
    <div className={`min-h-screen ${pageBackground} p-3 sm:p-5 md:p-8 font-sans transition-colors duration-200`}>
      <div className="max-w-4xl mx-auto">
        {/* Persistent Header */}
        <Header
          level={currentLevel}
          points={points}
          streak={streak}
          completedToday={completedToday}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onHomeClick={() => {
            sound.playPop();
            setCurrentScreen('home');
          }}
        />

        {/* Dynamic Screen Routing */}
        <main>
          {currentScreen === 'home' && (
            <HomeScreen
              level={currentLevel}
              nextLevel={nextLevel}
              points={points}
              streak={streak}
              completedToday={completedToday}
              weekDays={weekDays}
              sessions={sessions}
              badges={BADGE_DEFINITIONS}
              theme={currentTheme}
              userName={userName}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onStartSetup={() => setCurrentScreen('setup')}
              onViewBadges={() => setCurrentScreen('badges')}
              onViewStats={() => setCurrentScreen('stats')}
            />
          )}

          {currentScreen === 'setup' && (
            <SetupScreen
              onStartRound={handleStartRound}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'read' && activeText && (
            <ReadingScreen
              round={activeRound}
              textData={activeText}
              settings={settings}
              onFinishReading={handleFinishReading}
              onCancel={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'mark' && activeText && (
            <MarkingScreen
              round={activeRound}
              textData={activeText}
              elapsedSeconds={elapsedSeconds}
              onConfirmWordCount={handleConfirmWordCount}
              onBackToRead={() => setCurrentScreen('read')}
            />
          )}

          {currentScreen === 'model' && activeText && (
            <ModelReadingScreen
              textData={activeText}
              onProceedToPacer={handleProceedToPacer}
              onBackToMark={() => setCurrentScreen('mark')}
            />
          )}

          {currentScreen === 'pace' && activeText && (
            <PacingScreen
              textData={activeText}
              round1Wpm={round1Wpm}
              userName={userName}
              onProceedToRound2={handleProceedToRound2}
              onBackToModel={() => setCurrentScreen('model')}
            />
          )}

          {currentScreen === 'result' && activeText && (
            <ResultScreen
              textData={activeText}
              round1Wpm={round1Wpm}
              round2Wpm={round2Wpm}
              existingSessions={sessions}
              allBadges={BADGE_DEFINITIONS}
              userName={userName}
              onFinishSession={handleFinishSession}
              onRestartNewText={handleRestartNewText}
            />
          )}

          {currentScreen === 'badges' && (
            <BadgesScreen
              badges={BADGE_DEFINITIONS}
              sessions={sessions}
              onBack={() => setCurrentScreen('home')}
            />
          )}

          {currentScreen === 'stats' && (
            <StatsScreen
              sessions={sessions}
              onBack={() => setCurrentScreen('home')}
              onRefreshData={refreshData}
            />
          )}
        </main>

        {/* Global Settings & Guide Modal */}
        <SettingsModal
          settings={settings}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleUpdateSettings}
        />
      </div>
    </div>
  );
}
