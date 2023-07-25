import React, {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';
import AndroidPrompt from './AndroidPrompt';

const Game = props => {
  const [start, setStart] = useState(null);
  const [duration, setDuration] = useState(0);
  const androidPromptRef = useRef();

  useEffect(() => {
    let counter = 5;
    NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
      console.warn('tag found', tag);
      counter--;
      if (Platform.OS === 'android') {
        androidPromptRef.current.setText(`${counter}...`);
      } else {
        NfcManager.setAlertMessageIOS(`${counter}...`);
      }

      if (counter <= 0) {
        NfcManager.unregisterTagEvent().catch(() => 0);
        setDuration(new Date().getTime() - start.getTime());
        if (Platform.OS === 'android') {
          androidPromptRef.current.setVisible(false);
        }
      }
    });

    return () => NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
  }, [start]);

  const regTag = async () => {
    await NfcManager.registerTagEvent();
    if (Platform.OS === 'android') {
      androidPromptRef.current.setVisible(true);
    }
    setStart(new Date());
    setDuration(0);
  };

  return (
    <View style={styles.container}>
      <Text>NFC Game!!!</Text>
      {duration > 0 && <Text>{duration} ms</Text>}
      <TouchableOpacity style={styles.btn} onPress={regTag}>
        <Text style={styles.start}>Start</Text>
      </TouchableOpacity>
      <AndroidPrompt
        onClosePrompt={() => NfcManager.unregisterTagEvent().catch(() => 0)}
        ref={androidPromptRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: 80,
    margin: 8,
    borderWidth: 2,
    backgroundColor: '#ccc',
    color: 'black',
  },
  start: {
    textAlign: 'center',
    color: 'black',
  },
});

export default Game;
