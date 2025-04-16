import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Volume2, VolumeX, Pencil } from 'lucide-react';

interface TimerProps {
  id: string;
  onDelete: (id: string) => void;
}

const SOUND_OPTIONS = [
  { id: 'alarm_clock', name: 'Alarm Clock', url: '/alarm_clock.mp3' },
  { id: 'iphone_alarm', name: 'iPhone Alarm', url: '/iphone_alarm.mp3' },
  { id: 'morning_flower', name: 'Morning Flower', url: '/morning_flower.mp3' },
  { id: 'alarm', name: 'Alarm', url: '/alarm.mp3' },
  { id: 'clock_alarm_new_s4', name: 'Clock Alarm S4', url: '/clock_alarm_new_s4.mp3' },
  { id: 'good_morning', name: 'Good Morning', url: '/good_morning.mp3' },
  { id: 'morning_alarm', name: 'Morning Alarm', url: '/morning_alarm.mp3' },
  { id: 'raining_wake_up', name: 'Raining Wake Up', url: '/raining_wake_up.mp3' },
  { id: 'samsung_galaxy_s3', name: 'Samsung Galaxy S3', url: '/samsung_galaxy_s3.mp3' },
  { id: 'soft_morning_alarm', name: 'Soft Morning Alarm', url: '/soft_morning_alarm.mp3' },
];

const padNumber = (num: number): string => num.toString().padStart(2, '0');

export const Timer: React.FC<TimerProps> = ({ id, onDelete }) => {
  const [name, setName] = useState('Timer 1');
  const [isEditing, setIsEditing] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [selectedSound, setSelectedSound] = useState(SOUND_OPTIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [rawHours, setRawHours] = useState('00');
  const [rawMinutes, setRawMinutes] = useState('00');
  const [rawSeconds, setRawSeconds] = useState('00');
  const [editingField, setEditingField] = useState<'hours' | 'minutes' | 'seconds' | null>(null);

  useEffect(() => {
    let interval: number;
    
    if (isRunning && totalSeconds > 0) {
      interval = window.setInterval(() => {
        setTotalSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && totalSeconds === 0) {
      setIsRunning(false);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }

    return () => window.clearInterval(interval);
  }, [isRunning, totalSeconds]);

  useEffect(() => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    setHours(h);
    setMinutes(m);
    setSeconds(s);
  }, [totalSeconds]);

  useEffect(() => {
    if (!editingField) {
      setRawHours(padNumber(hours));
      setRawMinutes(padNumber(minutes));
      setRawSeconds(padNumber(seconds));
    }
  }, [hours, minutes, seconds, editingField]);

  const startTimer = useCallback(() => {
    if (totalSeconds === 0) {
      return; // Prevent starting when timer is at 00:00:00
    }
    setIsRunning(true);
  }, [totalSeconds]);

  const pauseTimer = () => setIsRunning(false);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTotalSeconds(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const toggleSound = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeInput = (value: string, type: 'hours' | 'minutes' | 'seconds') => {
    // Only allow up to 2 digits, numbers only
    let cleanValue = value.replace(/\D/g, '').slice(0, 2);
    if (cleanValue.length === 0) cleanValue = '0';
    let numValue = parseInt(cleanValue, 10);
    if (isNaN(numValue)) numValue = 0;
    const maxValue = type === 'hours' ? 99 : 59;
    if (numValue > maxValue) numValue = maxValue;
    if (type === 'hours') setRawHours(cleanValue);
    if (type === 'minutes') setRawMinutes(cleanValue);
    if (type === 'seconds') setRawSeconds(cleanValue);
  };

  const handleFieldFocus = (type: 'hours' | 'minutes' | 'seconds') => {
    setEditingField(type);
  };

  const handleFieldBlur = (type: 'hours' | 'minutes' | 'seconds') => {
    setEditingField(null);
    let numValue = 0;
    if (type === 'hours') numValue = parseInt(rawHours, 10) || 0;
    if (type === 'minutes') numValue = parseInt(rawMinutes, 10) || 0;
    if (type === 'seconds') numValue = parseInt(rawSeconds, 10) || 0;
    if (type === 'hours') setHours(numValue);
    if (type === 'minutes') setMinutes(numValue);
    if (type === 'seconds') setSeconds(numValue);
    // Update totalSeconds
    const h = type === 'hours' ? numValue : hours;
    const m = type === 'minutes' ? numValue : minutes;
    const s = type === 'seconds' ? numValue : seconds;
    setTotalSeconds(h * 3600 + m * 60 + s);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-10 gap-4 sm:gap-0">
        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setIsEditing(false)}
            className="text-lg sm:text-2xl font-medium bg-transparent border-b-2 border-teal-400 focus:outline-none"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-2xl font-medium text-gray-700">{name}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-teal-500 transition-colors"
            >
              <Pencil size={18} />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2 sm:gap-4">
          <select
            value={selectedSound.id}
            onChange={(e) => setSelectedSound(SOUND_OPTIONS.find(sound => sound.id === e.target.value) || SOUND_OPTIONS[0])}
            className="text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {SOUND_OPTIONS.map(sound => (
              <option key={sound.id} value={sound.id}>{sound.name}</option>
            ))}
          </select>
          <button
            onClick={toggleSound}
            className="p-1 sm:p-2 text-gray-400 hover:text-teal-500 transition-colors"
            aria-label={isPlaying ? "Stop sound" : "Test sound"}
          >
            {isPlaying ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-1 sm:p-2 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete timer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="text-center mb-6 sm:mb-10">
        <div className="flex justify-center items-center gap-1 sm:gap-2 text-4xl sm:text-8xl font-light">
          <input
            type="text"
            value={editingField === 'hours' ? rawHours : padNumber(hours)}
            onChange={(e) => handleTimeInput(e.target.value, 'hours')}
            onFocus={() => handleFieldFocus('hours')}
            onBlur={() => handleFieldBlur('hours')}
            className="w-14 sm:w-32 text-center bg-transparent focus:outline-none focus:border-b-2 focus:border-teal-400"
            disabled={isRunning}
            maxLength={2}
            placeholder="00"
            inputMode="numeric"
          />
          <span>:</span>
          <input
            type="text"
            value={editingField === 'minutes' ? rawMinutes : padNumber(minutes)}
            onChange={(e) => handleTimeInput(e.target.value, 'minutes')}
            onFocus={() => handleFieldFocus('minutes')}
            onBlur={() => handleFieldBlur('minutes')}
            className="w-14 sm:w-32 text-center bg-transparent focus:outline-none focus:border-b-2 focus:border-teal-400"
            disabled={isRunning}
            maxLength={2}
            placeholder="00"
            inputMode="numeric"
          />
          <span>:</span>
          <input
            type="text"
            value={editingField === 'seconds' ? rawSeconds : padNumber(seconds)}
            onChange={(e) => handleTimeInput(e.target.value, 'seconds')}
            onFocus={() => handleFieldFocus('seconds')}
            onBlur={() => handleFieldBlur('seconds')}
            className="w-14 sm:w-32 text-center bg-transparent focus:outline-none focus:border-b-2 focus:border-teal-400"
            disabled={isRunning}
            maxLength={2}
            placeholder="00"
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6">
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          disabled={!isRunning && totalSeconds === 0}
          className={`
            w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 rounded-full text-white font-medium transition-all transform hover:scale-105
            ${isRunning 
              ? 'bg-amber-500 hover:bg-amber-600' 
              : totalSeconds === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-teal-500 hover:bg-teal-600'
            }
          `}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 rounded-full border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      </div>

      <audio ref={audioRef} src={selectedSound.url} />
    </div>
  );
};