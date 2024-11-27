import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Image, 
  ActivityIndicator,
  Platform, 
  Dimensions,
  Animated,
  ImageBackground 
} from 'react-native';
import { useGameLogic } from './gameLogic';
import { formatEventDate } from './dataParser';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GameScreen() {
  const {
    currentEvent,
    nextEvent,
    message,
    score,
    handleAnswer,
    isLoading,
  } = useGameLogic();
  
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (message) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      const timeout = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [message]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={[styles.content, { 
        paddingTop: Platform.OS === 'ios' ? insets.top : 0,
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0
      }]}>
        {message && (
          <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>
            <Text style={styles.message}>{message}</Text>
          </Animated.View>
        )}

        {/* Top Event */}
        <View style={styles.eventSection}>
          {currentEvent && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: currentEvent.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.eventOverlay}>
                <Text style={styles.eventText}>{currentEvent.label}</Text>
                <Text style={styles.dateText}>{formatEventDate(currentEvent.date)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Control Section */}
        <View style={styles.controlSection}>
          <ImageBackground
            source={require('../assets/images/old-map-bg.jpg')}
            style={styles.mapBackground}
            resizeMode="cover"
          >
            <View style={styles.mapOverlay}>
              <View style={styles.buttonRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.beforeButton,
                    pressed && styles.buttonPressed
                  ]}
                  onPress={() => handleAnswer(true)}
                >
                  <Text style={styles.buttonText}>BEFORE</Text>
                </Pressable>

                <View style={styles.scoreContainer}>
                  <Text style={styles.score}>{score}</Text>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.afterButton,
                    pressed && styles.buttonPressed
                  ]}
                  onPress={() => handleAnswer(false)}
                >
                  <Text style={styles.buttonText}>AFTER</Text>
                </Pressable>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Bottom Event */}
        <View style={styles.eventSection}>
          {nextEvent && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: nextEvent.image }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.eventOverlay}>
                <Text style={styles.eventText}>{nextEvent.label}</Text>
                <Text style={styles.dateText}>????</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  eventSection: {
    flex: 0.47,
  },
  controlSection: {
    flex: 0.10,
  },
  mapBackground: {
    flex: 1,
    width: '100%',
  },
  mapOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#11b5d9',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#222',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  eventOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderColor: '#11b5d9',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    gap: 10,
  },
  scoreContainer: {
    backgroundColor: '#2ca9e3',
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#057f99',
    marginHorizontal: 10,
  },
  button: {
    width: 110,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#057f99',
  },
  beforeButton: {
    backgroundColor: '#2ca9e3',
  },
  afterButton: {
    backgroundColor: '#2ca9e3',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Orbitron',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  score: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Orbitron',
    fontWeight: 'bold',
  },
  eventText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Orbitron',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Orbitron',
    marginTop: 3,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  messageContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: 50,
    zIndex: 10,
  },
  message: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Orbitron',
    textAlign: 'center',
    backgroundColor: '#11d41f',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#11b5d9',
    overflow: 'hidden',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});