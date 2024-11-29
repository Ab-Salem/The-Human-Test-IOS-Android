import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Dimensions, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const spaceRef = useRef<LottieView>(null);
  const earthRef = useRef<LottieView>(null);
  const [isPressed, setIsPressed] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [fontsLoaded] = useFonts({
    'IMFellDWPica': require('../assets/fonts/IMFellDWPica-Regular.ttf'),
  });

  useEffect(() => {
    const flashText = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ]).start(() => {
        if (!isPressed) {
          flashText();
        }
      });
    };

    flashText();
  }, [fadeAnim, isPressed]);

  const handlePress = () => {
    if (!isPressed) {
      setIsPressed(true);
      setTimeout(() => {
        router.push('/game');
      }, 500);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Pressable 
      style={styles.container}
      onPress={handlePress}
      disabled={isPressed}
    >
      <View style={styles.backgroundContainer}>
        <LottieView
          ref={spaceRef}
          source={require('../assets/animation/space2.json')}
          style={styles.backgroundAnimation}
          autoPlay
          loop
          resizeMode="cover"
        />
      </View>

      <View style={styles.titleContainer}>
        {/* Shadow Layers */}
        {[...Array(15)].map((_, i) => (
          <Text
            key={i}
            style={[
              styles.titleText,
              styles.shadowText,
              {
                position: 'absolute',
                left: -i * 2,
                top: i * 4,
                zIndex: 15 - i,
                color: `rgba(50, 50, 50, ${(15 - i) / 15})`,
              },
            ]}
          >
            THE HUMAN TEST
          </Text>
        ))}
        {/* Main Title Text */}
        <Text style={[styles.titleText, styles.titleMain]}>
          THE HUMAN TEST
          <Text style={styles.tradeMark}>TM</Text>
        </Text>
      </View>

      <LottieView
        ref={earthRef}
        source={require('../assets/animation/earth.json')}
        style={styles.earthAnimation}
        autoPlay
        loop
        speed={1}
      />

      <Animated.Text 
        style={[
          styles.startText,
          { opacity: fadeAnim }
        ]}
      >
        Press anywhere to Start
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundAnimation: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    position: 'absolute',
    top: height * 0.15,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.2,
  },
  titleText: {
    fontFamily: 'IMFellDWPica',
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
  },
  shadowText: {
    width: '100%',
    height:'100%',
  },
  titleMain: {
    color: 'white',
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: -5, height: 0 },
    textShadowRadius: 10,
    zIndex: 20,
    position: 'relative',
  },
  tradeMark: {
    fontSize: 16,
    position: 'relative',
    top: -20,
    marginLeft: 4,
  },
  earthAnimation: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -(width * 0.4) },
      { translateY: -(width * 0.4) },
    ],
  },
  startText: {
    position: 'absolute',
    bottom: height * 0.2,
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontSize: 30,
    fontFamily: 'IMFellDWPica',
    fontWeight: 'bold',
  },
});