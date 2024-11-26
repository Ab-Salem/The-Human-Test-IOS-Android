import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const spaceRef = useRef<LottieView>(null);
  const forestRef = useRef<LottieView>(null);
  const alienRef = useRef<LottieView>(null);
  const hikerRef = useRef<LottieView>(null);

  const [currentBackground, setCurrentBackground] = useState('space');
  const [showButton, setShowButton] = useState(false);
  
  const alienPosition = useRef(new Animated.ValueXY({ x: width, y: -100 })).current;

  useEffect(() => {
    const startAnimationSequence = async () => {
      // Play space background
      spaceRef.current?.play();
      
      // Longer initial delay for space scene
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Animate alien flying to center in space scene
      Animated.timing(alienPosition, {
        toValue: { x: width * 0.3, y: height * 0.4 }, // Center of screen
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }).start();
      
      alienRef.current?.play();
      
      // Wait before changing background
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Change background to forest
      setCurrentBackground('forest');
      forestRef.current?.play();
      
      // Show hiker
      hikerRef.current?.play();
      
      // Reset and animate alien again
      alienPosition.setValue({ x: width, y: -100 });
      
      // Wait before starting second alien animation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Animate alien flying to top right in forest scene
      Animated.timing(alienPosition, {
        toValue: { x: width * 0.4, y: height * 0.15 }, // Top right corner
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }).start();
      
      // Longer delay before showing play button
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      setShowButton(true);
    };

    startAnimationSequence();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Animations */}
      {currentBackground === 'space' && (
        <LottieView
          ref={spaceRef}
          source={require('../assets/animation/space.json')}
          style={styles.backgroundAnimation}
          loop
        />
      )}
      {currentBackground === 'forest' && (
        <LottieView
          ref={forestRef}
          source={require('../assets/animation/forest.json')}
          style={styles.backgroundAnimation}
          loop
        />
      )}
      
      {/* Character Animations */}
      <Animated.View
        style={[
          styles.alienContainer,
          {
            transform: [
              { translateX: alienPosition.x },
              { translateY: alienPosition.y }
            ]
          }
        ]}
      >
        <LottieView
          ref={alienRef}
          source={require('../assets/animation/alien.json')}
          style={styles.alienAnimation}
          loop
        />
      </Animated.View>
      
      {currentBackground === 'forest' && (
        <View style={styles.hikerContainer}>
          <LottieView
            ref={hikerRef}
            source={require('../assets/animation/hiker.json')}
            style={styles.hikerAnimation}
            loop
          />
        </View>
      )}
      
      {/* Play Button */}
      {showButton && (
        <Pressable
          style={styles.playButton}
          onPress={() => router.push('/game')}
        >
          <Text style={styles.playButtonText}>Play</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backgroundAnimation: {
    position: 'absolute',
    width: width,
    height: height,
  },
  alienContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  alienAnimation: {
    width: '100%',
    height: '100%',
  },
  hikerContainer: {
    position: 'absolute',
    width: 500,
    height: height,
    left: -100,
    top: height * 0.4, // Position from top to show upper body
  },
  hikerAnimation: {
    width: '80%',
    height: '80%',
    position: 'absolute',
  },
  playButton: {
    position: 'absolute',
    bottom: height * 0.25,
    right: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  playButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});