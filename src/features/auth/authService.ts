import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../shared/services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";

export const loginUser = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const logOutUser = async () => {
  await auth.signOut();
};

export const registerUser = async (email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const updateUserDisplayName = async (displayName: string) => {
  if (!auth.currentUser) {
    throw new Error("No authenticated user.");
  }
  await updateProfile(auth.currentUser, {
    displayName,
  });
  await auth.currentUser.reload();
  return auth.currentUser;
};
