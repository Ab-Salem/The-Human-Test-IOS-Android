import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

export default function VictoryScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    'IMFellDWPica': require('../assets/fonts/IMFellDWPica-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animation/space2.json')}
        style={styles.backgroundAnimation}
        autoPlay
        loop
        resizeMode="cover"
      />

      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/alien.jpg')}
            style={styles.alienImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Congratulations!</Text>
          <Text style={styles.subtitleText}>You are <Text style={styles.percentText}>100%</Text> human.</Text>
          <Text style={styles.subtitleText}>You saved the planet!</Text>
        </View>

        <Pressable
          style={styles.button}
          onPress={() => router.push('/home')}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
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
  backgroundAnimation: {
    position: 'absolute',
    width: width,
    height: height,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: height * 0.1,
  },
  imageContainer: {
    borderWidth: 3,
    borderColor: 'green',
    marginTop: height * 0.05,
    // Maintain aspect ratio of 4800:2900
    width: width * 0.4,
    height: (width * 0.9 * 2900) / 4800,
  },
  alienImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: 'white',
    width: width * 0.9, // Made smaller than previous version
  },
  titleText: {
    fontFamily: 'IMFellDWPica',
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitleText: {
    fontFamily: 'IMFellDWPica',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginVertical: 5,
  },
  percentText: {
    color: '#1c9800', // Bright green
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 40,
    marginTop: height * 0.01,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'IMFellDWPica',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});