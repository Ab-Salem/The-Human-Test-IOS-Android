import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

export default function GameOverScreen() {
  const router = useRouter();
  const spaceRef = useRef<LottieView>(null);
  const earthRef = useRef<LottieView>(null);
  const explosionRef = useRef<LottieView>(null);
  const rocketRef = useRef<LottieView>(null);
  const [showContent, setShowContent] = useState(false);
  const [showRocket, setShowRocket] = useState(true);
  
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    'IMFellDWPica': require('../assets/fonts/IMFellDWPica-Regular.ttf'),
  });

  useEffect(() => {
    const prepare = async () => {
      if (!fontsLoaded) {
        await SplashScreen.preventAutoHideAsync();
      } else {
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, [fontsLoaded]);

  useEffect(() => {
    // Start rocket movement animation
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: width * 0.5,
        duration: 3500,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -height * 0.5,
        duration: 3500,
        useNativeDriver: true,
      }),
    ]).start();

    const startSequence = async () => {
      // Wait longer for rocket animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Hide rocket and trigger explosion
      explosionRef.current?.play();
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowRocket(false);
      // Wait for explosion animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowContent(true);
    };

    startSequence();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LottieView
        ref={spaceRef}
        source={require('../assets/animation/space2.json')}
        style={styles.backgroundAnimation}
        autoPlay
        loop
        speed={1}
      />

      <LottieView
        ref={earthRef}
        source={require('../assets/animation/earth.json')}
        style={styles.earthAnimation}
        autoPlay
        loop
        speed={1}
      />
      
      {showRocket && (
        <Animated.View style={[
          styles.rocketContainer,
          {
            transform: [
              { translateX: translateX },
              { translateY: translateY },
            ]
          }
        ]}>
          <LottieView
            ref={rocketRef}
            source={require('../assets/animation/rocket.json')}
            style={styles.rocketAnimation}
            //autoPlay
            loop={false}
            speed={1}
          />
        </Animated.View>
      )}

      <LottieView
        ref={explosionRef}
        source={require('../assets/animation/explosion.json')}
        style={styles.explosionAnimation}
        loop={false}
      />
      
      {showContent && (
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Game Over!</Text>
          <Text style={styles.message}>Better luck next time!</Text>
          
          <Pressable
            style={styles.button}
            onPress={() => router.push('/game')}
          >
            <Text style={styles.buttonText}>Play Again</Text>
          </Pressable>
          
          <Pressable
            style={[styles.button, styles.homeButton]}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
          </Pressable>
        </View>
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
  earthAnimation: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -(width * 0.3) },
      { translateY: -(width * 0.3) },
    ],
  },
  rocketContainer: {
    position: 'absolute',
    bottom: -20,
    left: -75,
  },
  rocketAnimation: {
    width: width * 0.3,
    height: width * 0.3,
  },
  explosionAnimation: {
    position: 'absolute',
    width: width * 2,
    height: width * 2,
    alignSelf: 'center',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -width },
      { translateY: -width },
    ],
  },
  contentContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'IMFellDWPica',
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'Black',
  },
  message: {
    fontFamily: 'IMFellDWPica',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
    color: 'Black',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  homeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    borderColor: 'black',
  },
  buttonText: {
    fontFamily: 'IMFellDWPica',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});