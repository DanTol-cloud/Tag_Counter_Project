import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';

const AndroidPrompt = (props, ref) => {
  const {onClosePrompt} = props;
  const [_visible, _setVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (ref) {
      ref.current = {
        setVisible: _setVisible,
        setText,
      };
    }
  }, [ref]);

  useEffect(() => {
    if (_visible) {
      setVisible(true);
      Animated.timing(animValue, {
        duration: 300,
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animValue, {
        duration: 300,
        toValue: 0,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
        setText('');
      });
    }
  }, [_visible, animValue]);

  const closeModal = () => {
    _setVisible(false);
    onClosePrompt();
  };

  const backgroundAnimValue = {
    opacity: animValue,
  };

  const promptAnimStyle = {
    transform: [
      {
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [500, 0],
        }),
      },
    ],
  };

  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.container}>
        <Animated.View
          style={[styles.backRap, StyleSheet.absoluteFill, backgroundAnimValue]}
        />
        <Animated.View style={[styles.prompt, promptAnimStyle]}>
          <Text style={styles.text}>{text || 'Hello NFC!!!'}</Text>

          <TouchableOpacity style={styles.btn} onPress={closeModal}>
            <Text style={styles.text}>CANCEL</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backRap: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  prompt: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    borderRadius: 8,
    paddingVertical: 60,
    paddingHorizontal: 20,
    width: Dimensions.get('window').width - 2 * 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    color: 'black',
  },
  btn: {
    borderWidth: 2,
    borderRadius: 4,
    width: 80,
    backgroundColor: 'gray',
  },
});

export default React.forwardRef(AndroidPrompt);
