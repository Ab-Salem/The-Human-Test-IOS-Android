import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Animated as RNAnimated, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

interface DialogueBubbleProps {
  text: string;
  isAlien: boolean;
  style?: ViewStyle;
}

const DialogueBubble: React.FC<DialogueBubbleProps> = ({ text, isAlien, style }) => (
  <View style={[
    styles.dialogueBubble,
    isAlien ? styles.alienBubble : styles.hikerBubble,
    style
  ]}>
    <Text style={[
      styles.dialogueText,
      isAlien ? styles.alienText : styles.hikerText
    ]}>{text}</Text>
  </View>
);

export default function IntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const spaceRef = useRef<LottieView>(null);
  const forestRef = useRef<LottieView>(null);
  const alienRef = useRef<LottieView>(null);
  const hikerRef = useRef<LottieView>(null);

  const [fontsLoaded] = useFonts({
    'Orbitron': require('../assets/fonts/Orbitron-Regular.ttf'),
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [currentBackground, setCurrentBackground] = useState('space');
  const [currentDialogue, setCurrentDialogue] = useState('');
  const [dialogueType, setDialogueType] = useState<'alien' | 'hiker' | null>(null);
  
  const alienPosition = useRef(new Animated.ValueXY({ x: width, y: -100 })).current;
  const bubbleOpacity = useRef(new RNAnimated.Value(0)).current;

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

  const showDialogue = (text: string, type: 'alien' | 'hiker') => {
    setCurrentDialogue(text);
    setDialogueType(type);
    RNAnimated.timing(bubbleOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideDialogue = () => {
    RNAnimated.timing(bubbleOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentDialogue('');
      setDialogueType(null);
    });
  };

  useEffect(() => {
    const startAnimationSequence = async () => {
      spaceRef.current?.play();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Animated.timing(alienPosition, {
        toValue: { x: width * 0.3, y: height * 0.4 },
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }).start();
      
      alienRef.current?.play();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await new Promise(resolve => setTimeout(resolve, 4000));
      setCurrentBackground('forest');
      forestRef.current?.play();
      hikerRef.current?.play();
      
      alienPosition.setValue({ x: width, y: -100 });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      Animated.timing(alienPosition, {
        toValue: { x: width * 0.4, y: height * 0.15 },
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true
      }).start();

      await new Promise(resolve => setTimeout(resolve, 3000));

      showDialogue("Are you a human?? I need a human ASAP!! The earth is about to explode!", "alien");
      await new Promise(resolve => setTimeout(resolve, 3000));

      hideDialogue();
      await new Promise(resolve => setTimeout(resolve, 500));
      showDialogue("yeah", "hiker");
      await new Promise(resolve => setTimeout(resolve, 2000));

      hideDialogue();
      await new Promise(resolve => setTimeout(resolve, 1000));
      showDialogue("Are you sure??", "alien");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      hideDialogue();
      await new Promise(resolve => setTimeout(resolve, 500));
      showDialogue("yeah", "hiker");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      hideDialogue();
      await new Promise(resolve => setTimeout(resolve, 500));
      showDialogue("hmm... i dont know...", "alien");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      hideDialogue();
      await new Promise(resolve => setTimeout(resolve, 500));
      showDialogue("Can you prove it to me?? I need to be fully sure.", "alien");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      hideDialogue();
      await new Promise(resolve => setTimeout(resolve, 500));
      showDialogue("How", "hiker");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      hideDialogue();
      await new Promise(resolve => setTimeout(resolve, 500));
      showDialogue("Take this test to prove you are human.", "alien");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      hideDialogue();
      router.push('/home');
    };

    startAnimationSequence();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
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
            loop={true}
            autoPlay={true}
          />
        </View>
      )}
      
      {currentDialogue && (
        <RNAnimated.View style={[styles.dialogueContainer, { opacity: bubbleOpacity }]}>
          <DialogueBubble
            text={currentDialogue}
            isAlien={dialogueType === 'alien'}
            style={dialogueType === 'hiker' ? { alignSelf: 'flex-start', marginLeft: 20 } : { alignSelf: 'flex-end', marginRight: 20 }}
          />
        </RNAnimated.View>
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
    top: height * 0.5,
  },
  hikerAnimation: {
    width: '80%',
    height: '80%',
    position: 'absolute',
  },
  dialogueContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 5,
    paddingBottom: height * 0.5,
  },
  dialogueBubble: {
    maxWidth: '70%',
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
  },
  alienBubble: {
    backgroundColor: 'rgba(100, 200, 255, 0.9)',
    borderTopRightRadius: 5,
    marginTop: height * 0.4,
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  hikerBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopLeftRadius: 5,
    position: 'absolute',
    bottom: height * 0.25,
    left: width * 0.50,
  },
  dialogueText: {
    fontSize: 16,
    color: '#000',
  },
  alienText: {
    fontFamily: 'Orbitron',
  },
  hikerText: {
    fontFamily: 'SpaceMono',
  }
});