//app/gameLogic.tsx
import { useState, useEffect } from 'react';
import { getRandomHistoricalEvent, initializeDatasets, formatEventDate, HistoricalEvent } from './dataParser';
import { useRouter } from 'expo-router';
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { Platform } from 'react-native';
import React from 'react';

const DATASETS = [
  'dataset1',
  'dataset2',
  'dataset3',
  'dataset4',
  'dataset5'
];

const useGameLogic = () => {
  const [currentEvent, setCurrentEvent] = useState<HistoricalEvent | null>(null);
  const [nextEvent, setNextEvent] = useState<HistoricalEvent | null>(null);
  const [message, setMessage] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageLoading, setCurrentImageLoading] = useState(false);
  const [correctSound, setCorrectSound] = useState<Audio.Sound | null>(null);
  const [wrongSound, setWrongSound] = useState<Audio.Sound | null>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [correctSoundDuration, setCorrectSoundDuration] = useState<number | null>(null);
  const [wrongSoundDuration, setWrongSoundDuration] = useState<number | null>(null);

  const router = useRouter();

  // Initialize audio system
  useEffect(() => {
    let isMounted = true;

    async function initializeAudio() {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });

        const correctSoundAsset = require('../assets/audio/correct.wav');
        const wrongSoundAsset = require('../assets/audio/wrong.wav');

        const [correctResult, wrongResult] = await Promise.all([
          Audio.Sound.createAsync(
            correctSoundAsset,
            { 
              shouldPlay: false,
              volume: 1.0,
              androidImplementation: Platform.OS === 'android' ? 'OpenSLES' : undefined,
            }
          ),
          Audio.Sound.createAsync(
            wrongSoundAsset,
            { 
              shouldPlay: false,
              volume: 1.0,
              androidImplementation: Platform.OS === 'android' ? 'OpenSLES' : undefined,
            }
          )
        ]);

        // Get initial durations
        const correctStatus = await correctResult.sound.getStatusAsync();
        const wrongStatus = await wrongResult.sound.getStatusAsync();

        if (correctStatus.isLoaded) {
          setCorrectSoundDuration(correctStatus.durationMillis ?? null);
        }
        if (wrongStatus.isLoaded) {
          setWrongSoundDuration(wrongStatus.durationMillis ?? null);
        }

        if (isMounted) {
          setCorrectSound(correctResult.sound);
          setWrongSound(wrongResult.sound);
          setIsAudioReady(true);
          console.log('Audio system initialized successfully');
        }
      } catch (error) {
        console.error('Failed to initialize audio:', error);
        if (isMounted) {
          setError('Audio system initialization failed');
          setIsAudioReady(false);
        }
      }
    }

    initializeAudio();

    return () => {
      isMounted = false;
      if (correctSound) {
        correctSound.unloadAsync().catch(console.error);
      }
      if (wrongSound) {
        wrongSound.unloadAsync().catch(console.error);
      }
    };
  }, []);

  // Play sound with platform-specific handling
  const playSound = async (isCorrect: boolean) => {
    const sound = isCorrect ? correctSound : wrongSound;
    const soundDuration = isCorrect ? correctSoundDuration : wrongSoundDuration;
    const soundAsset = isCorrect ? require('../assets/audio/correct.wav') : require('../assets/audio/wrong.wav');

    if (!sound || !isAudioReady) {
      console.warn('Sound not ready');
      return;
    }

    try {
      const status = await sound.getStatusAsync();

      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound.stopAsync();
        }

        await sound.setPositionAsync(0);
        await sound.setVolumeAsync(Platform.OS === 'ios' ? 1.0 : 0.8);
        
        // Update duration if it's available
        if (status.durationMillis) {
          if (isCorrect) {
            setCorrectSoundDuration(status.durationMillis);
          } else {
            setWrongSoundDuration(status.durationMillis);
          }
        }
        
        // Play the sound and handle completion
        await sound.playAsync();

        // On Android, handle completion
        if (Platform.OS === 'android') {
          sound.setOnPlaybackStatusUpdate(async (playbackStatus: AVPlaybackStatus) => {
            if (playbackStatus.isLoaded) {
              const status = playbackStatus as AVPlaybackStatusSuccess;
              
              // Check if we've reached the end of the sound
              const duration = status.durationMillis ?? soundDuration;
              if (duration && status.positionMillis >= duration - 50) { // Add small buffer
                await sound.stopAsync();
                await sound.unloadAsync();
                
                // Reload the sound for next use
                try {
                  const { sound: newSound } = await Audio.Sound.createAsync(
                    soundAsset,
                    { shouldPlay: false }
                  );
                  
                  // Get new sound duration
                  const newStatus = await newSound.getStatusAsync();
                  if (newStatus.isLoaded && newStatus.durationMillis) {
                    if (isCorrect) {
                      setCorrectSoundDuration(newStatus.durationMillis);
                      setCorrectSound(newSound);
                    } else {
                      setWrongSoundDuration(newStatus.durationMillis);
                      setWrongSound(newSound);
                    }
                  }
                } catch (reloadError) {
                  console.error('Error reloading sound:', reloadError);
                }
              }
            }
          });
        }
      } else {
        console.warn('Sound is not loaded');
        throw new Error('Sound is not loaded');
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      
      // Attempt to recover from error
      try {
        if (sound) {
          await sound.unloadAsync();
          const { sound: newSound } = await Audio.Sound.createAsync(
            soundAsset,
            { shouldPlay: false }
          );
          
          // Get new sound duration after recovery
          const newStatus = await newSound.getStatusAsync();
          if (newStatus.isLoaded && newStatus.durationMillis) {
            if (isCorrect) {
              setCorrectSoundDuration(newStatus.durationMillis);
              setCorrectSound(newSound);
            } else {
              setWrongSoundDuration(newStatus.durationMillis);
              setWrongSound(newSound);
            }
          }
        }
      } catch (recoveryError) {
        console.error('Failed to recover audio:', recoveryError);
      }
    }
  };

  // Get a random dataset
  const getRandomDataset = (): string => {
    const randomIndex = Math.floor(Math.random() * DATASETS.length);
    return DATASETS[randomIndex];
  };

  // Get a random event from any dataset
  const getRandomEvent = async (): Promise<HistoricalEvent> => {
    const randomDataset = getRandomDataset();
    return await getRandomHistoricalEvent(randomDataset);
  };

  // Initialize the game with random events
  const initializeGame = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Initialize datasets
      await initializeDatasets();
      
      // Get initial events from random datasets
      const [firstEvent, secondEvent] = await Promise.all([
        getRandomEvent(),
        getRandomEvent()
      ]);

      // Make sure we don't get the same event twice
      if (firstEvent.event === secondEvent.event) {
        const newSecondEvent = await getRandomEvent();
        setNextEvent(newSecondEvent);
      } else {
        setNextEvent(secondEvent);
      }

      setCurrentEvent(firstEvent);
      setMessage('');
      setScore(0);
    } catch (error) {
      setError('Failed to load game data. Please try again.');
      console.error('Error initializing game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load game on mount
  useEffect(() => {
    initializeGame();
  }, []);

  // Get next event
  const loadNextEvent = async () => {
    try {
      let newEvent = await getRandomEvent();
      
      // Make sure we don't get the same event as current
      while (newEvent.event === currentEvent?.event) {
        newEvent = await getRandomEvent();
      }
      
      setNextEvent(newEvent);
    } catch (error) {
      console.error('Error loading next event:', error);
      setError('Failed to load next event');
    }
  };

  // Handle user's answer
  const handleAnswer = async (isBefore: boolean) => {
    if (!nextEvent || !currentEvent) return;

    const isCorrect =
      (isBefore && nextEvent.date < currentEvent.date) ||
      (!isBefore && nextEvent.date > currentEvent.date);

    if (isCorrect) {
      // Play correct sound first, then update UI
      if (isAudioReady) {
        await playSound(true).catch(console.error);
      }
      
      setScore(prevScore => prevScore + 1);
      setMessage(`Correct! ${nextEvent.label} happened in ${formatEventDate(nextEvent.date)}`);
      setCurrentEvent(nextEvent);
      setCurrentImageLoading(true);
      await loadNextEvent();
      return { isCorrect: true };
    } else {
      // Play wrong sound before game over
      if (isAudioReady) {
        await playSound(false).catch(console.error);
      }

      //setMessage(`Game Over! ${nextEvent.label} happened in ${formatEventDate(nextEvent.date)}`);
      router.push({
        pathname: '/gameover',
        params: { finalScore: score }
      });
      return { isCorrect: false };
    }
  };

  // Handle image load complete
  const handleImageLoadComplete = () => {
    setCurrentImageLoading(false);
  };

  // Reset game
  const resetGame = () => {
    initializeGame();
  };

  return {
    currentEvent,
    nextEvent,
    message,
    score,
    isLoading,
    error,
    currentImageLoading,
    handleAnswer,
    handleImageLoadComplete,
    resetGame,
    formatEventDate,
    isAudioReady
  };
};

const GameLogic: React.FC = () => null;
export default GameLogic;

export { useGameLogic };