import React, { useEffect, useReducer } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Input, CheckBox, Button, Divider } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

// Action types
const SET_USERNAME = 'SET_USERNAME';
const SET_PASSWORD = 'SET_PASSWORD';
const TOGGLE_REMEMBER = 'TOGGLE_REMEMBER';
const SET_CREDENTIALS = 'SET_CREDENTIALS';

// State & reducer
interface LoginState {
  username: string;
  password: string;
  remember: boolean;
}

type Action =
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'TOGGLE_REMEMBER' }
  | { type: 'SET_CREDENTIALS'; payload: { username: string; password: string } };

const initialState: LoginState = {
  username: '',
  password: '',
  remember: false,
};

function reducer(state: LoginState, action: Action): LoginState {
  switch (action.type) {
    case SET_USERNAME:
      return { ...state, username: action.payload };
    case SET_PASSWORD:
      return { ...state, password: action.payload };
    case TOGGLE_REMEMBER:
      return { ...state, remember: !state.remember };
    case SET_CREDENTIALS:
      return {
        ...state,
        username: action.payload.username,
        password: action.payload.password,
        remember: true,
      };
    default:
      return state;
  }
}

export default function LoginScreen() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const getUserData = async () => {
      const userdata = await SecureStore.getItemAsync('userinfo');
      if (userdata) {
        const info = JSON.parse(userdata);
        dispatch({ type: SET_CREDENTIALS, payload: info });
      }
    };
    getUserData();
  }, []);

  const handleLogin = async () => {
    if (state.remember) {
      await SecureStore.setItemAsync(
        'userinfo',
        JSON.stringify({ username: state.username, password: state.password })
      );
    } else {
      await SecureStore.deleteItemAsync('userinfo');
    }

    Alert.alert('Login Success', `Welcome back, ${state.username}!`);
    // TODO: loginUser logic or API call here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Meme Machine</Text>

      <Input
        placeholder="Username"
        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
        value={state.username}
        onChangeText={(text) => dispatch({ type: SET_USERNAME, payload: text })}
        containerStyle={styles.formInput}
        leftIconContainerStyle={styles.formIcon}
      />
      <Input
        placeholder="Password"
        secureTextEntry
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        value={state.password}
        onChangeText={(text) => dispatch({ type: SET_PASSWORD, payload: text })}
        containerStyle={styles.formInput}
        leftIconContainerStyle={styles.formIcon}
      />

      <CheckBox
        title="Remember Me"
        center
        checked={state.remember}
        onPress={() => dispatch({ type: TOGGLE_REMEMBER })}
        containerStyle={styles.formCheckbox}
      />

      <View style={{ marginTop: 30 }}>
        <Button title="Log In" onPress={handleLogin} />
        <Button title="Cancel" type="outline" containerStyle={{ marginTop: 10 }} />
      </View>

      <Divider width={0.2} style={{ marginTop: 20 }} />

      <View style={styles.formButton}>
        <Button
          type="outline"
          title="Sign up"
          onPress={() => router.push('/signup')}
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
  formCheckbox: {
    margin: 10,
    backgroundColor: 'transparent',
  },
  formButton: {
    marginTop: 20,
  },
  text: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 40,
  },
});
