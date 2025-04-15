import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');

  const handleSubmit = () => {
    if (!email || !username || !password || !passwordAgain) {
      Alert.alert('Incomplete', 'Please fill in all fields.');
      return;
    }

    if (password !== passwordAgain) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    // Simulate registration success
    Alert.alert('Signed up!', `Welcome, ${username}!`);
    router.replace('/(tabs)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Meme Machine</Text>

      <Input
        placeholder="Email"
        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={styles.formInput}
        leftIconContainerStyle={styles.formIcon}
      />
      <Input
        placeholder="Username"
        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        containerStyle={styles.formInput}
        leftIconContainerStyle={styles.formIcon}
      />
      <Input
        placeholder="Password"
        secureTextEntry
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        value={password}
        onChangeText={setPassword}
        containerStyle={styles.formInput}
        leftIconContainerStyle={styles.formIcon}
      />
      <Input
        placeholder="Verify Password"
        secureTextEntry
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        value={passwordAgain}
        onChangeText={setPasswordAgain}
        containerStyle={styles.formInput}
        leftIconContainerStyle={styles.formIcon}
      />

      <View style={styles.buttons}>
        <Button title="Submit" onPress={handleSubmit} />
        <Button
          title="Cancel"
          type="outline"
          onPress={() => router.push('/(tabs)/login')}
          containerStyle={{ marginTop: 10 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    margin: 20,
  },
  formInput: {
    padding: 10,
  },
  formIcon: {
    marginRight: 10,
  },
  buttons: {
    marginTop: 30,
  },
  text: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 40,
  },
});
