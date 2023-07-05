import {Modal} from 'native-base';
import React from 'react';
import {Image, StyleSheet} from 'react-native';

interface LoadingModalProps {
  isOpen: boolean;
}

function LoadingModal({isOpen}: LoadingModalProps) {
  return (
    <Modal isOpen={isOpen}>
      <Image
        source={require('../assets/loading-bars.gif')}
        style={styles.image}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
  },
});

export {LoadingModal};
