import React, { useRef, useState } from 'react';
import { View, StyleSheet, Pressable, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const spaceRef = useRef<LottieView>(null);
  const startButtonRef = useRef<LottieView>(null);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const earthRef = useRef<LottieView>(null);

  const handlePlayPress = () => {
    if (!isButtonPressed) {
      setIsButtonPressed(true);
      startButtonRef.current?.play();
      
      setTimeout(() => {
        router.push('/game');
      }, 1000);
    }
  };

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  return (
    <View style={styles.container}>
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
      
      <Image
        source={require('../assets/images/title.png')}
        style={styles.titleImage}
        resizeMode="contain"
      />

      <LottieView
        ref={earthRef}
        source={require('../assets/animation/earth.json')}
        style={styles.earthAnimation}
        autoPlay
        loop
        speed={1}
      />

      <View style={styles.buttonsContainer}>
        <Pressable 
          style={styles.playButtonContainer}
          onPress={handlePlayPress}
          disabled={isButtonPressed}
        >
          <LottieView
            ref={startButtonRef}
            source={require('../assets/animation/start.json')}
            style={styles.startButtonAnimation}
            loop={false}
            autoPlay={false}
            renderMode="HARDWARE"
          />
        </Pressable>

        <Pressable 
          style={styles.settingsButton}
          onPress={handleSettingsPress}
        >
          <LottieView
            source={require('../assets/animation/settings.json')}
            style={styles.settingsAnimation}
            loop={false}
            autoPlay={false}
            renderMode="HARDWARE"
          />
        </Pressable>
      </View>
    </View>
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
    titleImage: {
      position: 'absolute',
      top: height * 0.10,
      width: width * 0.8,
      height: height * 0.3,
      alignSelf: 'center',
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
    buttonsContainer: {
      position: 'absolute',
      width: '100%',
      top: height * 0.65,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: -50, // Increased negative gap to bring buttons closer
    },
    playButtonContainer: {
      width: 200, // Slightly reduced width
      height: 200, // Slightly reduced height
      justifyContent: 'center',
      alignItems: 'center',
    },
    startButtonAnimation: {
      width: '100%',
      height: '100%',
    },
    settingsButton: {
      width: 200, // Slightly reduced width
      height: 200, // Slightly reduced height
      justifyContent: 'center',
      alignItems: 'center',
    },
    settingsAnimation: {
      width: '100%',
      height: '100%',
    },
  });
