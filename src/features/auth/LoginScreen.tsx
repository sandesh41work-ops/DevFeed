import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import { useState } from 'react'
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';

const LoginScreen = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  function addDelay() {
    // function for test the loading indicator 
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 10000);
  }



  function handleLogin(email: string, password: string) {
    let userEmail = email.trim();
    let userPassword = password.trim();

    if (!userEmail) {
      setError("Please enter your email.");
      return false;
    }
    if (!userEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!userPassword) {
      setError("Please enter your password.");
      return false;
    }

    if (userPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError("");
    return true;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <Text style={styles.subtitle}>
          Login to continue
        </Text>

        <Input
          value={email}
          placeholder='Enter your email'
          onChangeText={setEmail}
          keyboardType="email-address"

        />
        <Input
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

        <Button
          title='Login'
          disabled={!email || !password}
          loading={loading}
          onPress={() => {
            // addDelay(); // for test the loading indicator
            handleLogin(email, password);
            console.log("Email: ", email)
            console.log("Password :", password)
          }}
        />

        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => {
            console.log('Navigate to Register Screen')
          }
          }>
          <Text style={styles.signupLinkText}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f7',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',

  },

  signupLink: {
    marginTop: 15,
  },
  signupLinkText: {
    color: '#2563eb',
    fontSize: 14,
    textAlign: 'center',
  }
})

