import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import CustomModal from '../customModal';

const DeletionModal = ({
  isModalVisible = false,
  onClosePress = () => {},
  onDeletionPress = () => {},
}) => {
  return (
    <CustomModal
      isModalVisible={isModalVisible}
      onClosePress={onClosePress}
      modalContainerStyle={{}}
      modalStyle={{backgroundColor: '#28282B'}}>
      <View style={styles.wrapper}>
        <Image
          style={{width: 30, height: 30}}
          source={require('../../icons/deletionIcon.png')}
        />
      </View>
      <Text style={styles.heading}>Are you sure you want to delete this?</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onClosePress} style={styles.button1}>
          <Text style={styles.btn}>No, Keep it.</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onDeletionPress();
            onClosePress();
          }}
          style={styles.button2}>
          <Text style={styles.btn}>Yes, Delete!</Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

export default DeletionModal;

const styles = StyleSheet.create({
  wrapper: {
    width: 40,
    height: 40,
    backgroundColor: '#ffcccb',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  heading: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 15,
  },
  button1: {
    width: 120,
    height: 40,
    backgroundColor: '#353935',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  button2: {
    width: 130,
    height: 40,
    backgroundColor: '#F75454',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 10,
  },
  btn: {
    color: '#fff',
    fontWeight: '500',
  },
});
