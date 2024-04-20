import React from 'react';
import {Modal, View} from 'react-native';
import styles from './styles';

const CustomModal = ({
  isModalVisible = false,
  onClosePress = () => {},
  children,
  modalContainerStyle,
  modalStyle,
  onShow = () => {},
  onAndroidBackPress = () => {},
  animationType = 'fade',
}) => {
  return (
    <>
      <Modal
        animationType={animationType ? animationType : 'fade'}
        supportedOrientations={['portrait', 'landscape']}
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          onClosePress();
          onAndroidBackPress();
        }}
        onShow={onShow}>
        <View style={[styles.modalContainer, modalContainerStyle]}>
          <View style={[styles.modalView, modalStyle]}>{children}</View>
        </View>
      </Modal>
    </>
  );
};

export default CustomModal;
