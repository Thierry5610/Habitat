import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import useDataBase from './InitializeDB';


const ResetPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    alert("This feature is yet to be implementd, so calm down and try to remember your password. If you still can't, then please contact our support at +237690582737 (WhatsApp)")
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./Assets/house_2163300.png')}
        style={styles.logoIcon}
      />
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#000000' }]}
        onPress={handleResetPassword}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 30,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  logoIcon: {
    height: 75,
    width: 75,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#f2f2f2',
    marginBottom: 30,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#000000',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ResetPassword;
