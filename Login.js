import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import useDataBase from './InitializeDB';
import { useUser } from './useUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Login = ({ route, navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { seeUser, seeUserProfiles } = useDataBase();
  const [users, setUsers] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [error, setError] = useState(null);
  const { userData, setUserData } = useUser();

  const storeLocal = async (data) => {
    try {
      await AsyncStorage.setItem('UserProfile', JSON.stringify(data));
      console.log('Data saved');
    } catch (e) {
      console.error("Couldn't save profile data: ", e);
    }
  };

  const handleLogin = async () => {
    console.log('Logging in...');
    if (!username.trim() || !password.trim()) {
      alert('Please enter both username and password.');
      return;
    }

    const user = users.find(
      (user) => user.username === username.trim() && user.password === password.trim()
    );
    if (user) {
      const profileExists = userProfiles.some((profile) => profile.id === user.id);
      if (profileExists) {
        console.log('Profile found');

        // Find the profile in userProfiles array
        const userProfile = userProfiles.find((profile) => profile.id === user.id);

        // Call storeLocal with the profile data
        try {
          await storeLocal(userProfile); // Assuming `userProfile` contains the profile data
          console.log('Profile data saved locally');
          setUserData(userProfile);
          console.log('Logingsd', userData);
        } catch (e) {
          console.error("Couldn't save profile data: ", e);
        }

        // Navigate to dashboard with profile data as param
        navigation.navigate('Feeds');
      } else {
        navigation.navigate('Profile', { user: user });
      }
    } else {
      alert('User not found or incorrect password.');
    }
  };

  const handleSignUp = () => {
    // Redirect or navigate to the sign-up screen
    console.log('Navigating to sign up screen...');
    navigation.navigate('SignUp');
  };

  const handleForgotPassword = () => {
    // Redirect or navigate to the password reset screen
    console.log('Navigating to password reset screen...');
    navigation.navigate('Reset');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Fetch users and userProfiles when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      Promise.all([seeUser(), seeUserProfiles()])
        .then(([usersData, profilesData]) => {
          setUsers(usersData);
          setUserProfiles(profilesData);
          setLoading(false);
          setLoadingProfiles(false);
          console.log('Doing my job');
        })
        .catch((error) => {
          console.error('Error fetching users or userProfiles:', error);
          setError('Error fetching data. Please try again later.');
          setLoading(false);
          setLoadingProfiles(false);
        });
    }, [])
  );

  return (
    <View style={styles.container}>
      <Image source={require('./Assets/house_2163300.png')} style={styles.logoIcon} />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.showPasswordButton} onPress={toggleShowPassword}>
          <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#555555" />
        </TouchableOpacity>
      </View>
      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#000000' }]}
        onPress={handleLogin}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account?</Text>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 30,
    position: 'relative',
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
    textAlign: 'center',
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
    marginBottom: 15,
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
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: '#87ceeb',
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  signUpText: {
    marginRight: 5,
  },
  signUpButton: {},
  signUpButtonText: {
    color: '#87ceeb',
    fontSize: 14,
  },
});

export default Login;
