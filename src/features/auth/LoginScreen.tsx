import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native'
import { use, useEffect, useState } from 'react'
import Button from '../../shared/components/Button';

function checkLoginCreds(email: string, password: string) {
  if (email.trim() === "" || password.trim() === "") {
    alert("Please enter both email and password.");

    return false;
  }
  return true;
}



const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false);

  function addDelay() {
    // function for test the loading indicator 
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 10000);
  }



  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <Text style={styles.subtitle}>
          Login to continue
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title='Login'
          disabled={false}
          loading={loading}
          onPress={() => {

            addDelay();

            checkLoginCreds(email, password);


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

