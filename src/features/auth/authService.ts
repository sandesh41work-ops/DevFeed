import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../shared/services/firebase"
import { createUserWithEmailAndPassword } from 'firebase/auth'

export const loginUser = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export const logOutUser = async () => {
  await auth.signOut();
}

export const registerUser = async (email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  return result.user
}