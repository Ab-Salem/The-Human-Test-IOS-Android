import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const spaceRef = useRef<LottieView>(null);
  const [isEasyMode, setIsEasyMode] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Space Background */}
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

      {/* Back Button */}
      <Pressable 
        style={styles.backButton} 
        onPress={handleBackPress}
      >
        <Text style={styles.backButtonText}>← BACK</Text>
      </Pressable>

      {/* Settings Content */}
      <View style={styles.settingsContainer}>
        <Text style={styles.title}>SETTINGS</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>EASY MODE</Text>
          <Switch
            value={isEasyMode}
            onValueChange={setIsEasyMode}
            trackColor={{ false: '#767577', true: '#11b5d9' }}
            thumbColor={isEasyMode ? '#e27321' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
      </View>
    </SafeAreaView>
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
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#11b5d9',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Orbitron',
  },
  settingsContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Orbitron',
    marginBottom: 40,
    marginTop: 60,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#11b5d9',
  },
  settingText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Orbitron',
  },
});