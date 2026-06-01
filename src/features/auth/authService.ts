import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../shared/services/firebase"

export const loginUser = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}
export const logOutUser = async () => {
  await auth.signOut();
}