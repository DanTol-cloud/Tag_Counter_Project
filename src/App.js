import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import NfcManager from 'react-native-nfc-manager';
import Game from './Game';

const App = props => {
  const [isEnable, setIsEnable] = useState(null);
  const [checkNFC, setCheckNFC] = useState(null);

  useEffect(() => {
    const isSupportedNfc = async () => {
      const supported = await NfcManager.isSupported();

      if (supported) {
        NfcManager.start();
        setIsEnable(await NfcManager.isEnabled());
      }
      setCheckNFC(supported);
    };

    isSupportedNfc();
  }, []);

  return checkNFC === null ? (
    <View style={styles.container}>
      <Text>NFC is not supported!!!</Text>
    </View>
  ) : !isEnable ? (
    <View style={styles.container}>
      <Text>NFC is not ENABLED!!!</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => NfcManager.goToNfcSetting()}>
        <Text style={styles.text}>Go to system settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btn}
        onPress={async () => setIsEnable(await NfcManager.isEnabled())}>
        <Text style={styles.text}>Check again</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <Game />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    borderWidth: 1,
    backgroundColor: '#ccc',
  },
  text: {
    textAlign: 'center',
    color: 'black',
  },
});

export default App;
