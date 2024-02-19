import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {v4}from 'uuid';
import useDataBase from './InitializeDB';

const SignUp = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    // Validate data before signing up
    if (!isValidUsername(username)) {
      alert('Invalid Username. Username must be at least 4 characters long and contain only letters and numbers.');
      return;
    }

    if (!isValidEmail(email)) {
      alert('Invalid Email. Please enter a valid email address.');
      return;
    }

    if (!isValidPassword(password)) {
      alert('Invalid Password. Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one special character, and one number.');
      return;
    }

    // Perform sign up logic here
    const userData = {
      id: v4(),
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
    };
    const {db,addUser} = useDataBase()
    addUser(userData.id,userData)
    console.log('User data:', userData);
    navigation.navigate('Login');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isValidUsername = (username) => /^[a-zA-Z0-9]{4,}$/.test(username.trim());
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isValidPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_@$!%*?&^#])[a-zA-Z\d_@$!%*?&^#]{6,}$/.test(password.trim());


  return (
    <View style={styles.container}>
      <Image
        source={require('./Assets/house_2163300.png')}
        style={styles.logoIcon}
      />
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity style={styles.showPasswordButton} onPress={toggleShowPassword}>
          <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#555555" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#000000' }]}
        onPress={handleSignUp}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
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
    marginBottom: 50,
  },
  input: {
    height: 50,
    backgroundColor: '#f2f2f2',
    marginBottom: 30,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    height: 50,
    backgroundColor: '#f2f2f2',
    marginBottom: 30,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  showPasswordButton: {
    position: 'absolute',
    top: 15,
    right: 10,
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

export default SignUp;
