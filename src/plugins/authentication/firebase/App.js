import firebase from 'firebase'
import './Init'
export function getLoggedInUser () {
  const currentUser = firebase.auth().currentUser
  if (currentUser) {
    return {
      email: firebase.auth().currentUser.email,
      userId: firebase.auth().currentUser.uid,
      isEmailVerified: firebase.auth().currentUser.emailVerified
    }
  } else {
    return undefined
  }
}

export function isAuthenticated () {
  return !!((this.getLoggedInUser() && this.getLoggedInUser().isEmailVerified === true))
}

export async function authenticate (email, password) {
  await firebase.auth().signInWithEmailAndPassword(email, password)
}
export async function signup (email, password) {
  const user = await firebase.auth().createUserWithEmailAndPassword(email, password)
  await user.user.sendEmailVerification()
  return `Check your email for verification mail before logging in`
}

export async function forgotPassword (email) {
  await firebase.auth().sendPasswordResetEmail(email)
  return (`Reset password link sent to ${email}`)
}

export async function logout () {
  await firebase.auth().signOut()
}

// (main.ts)
export function onAuthStateChanged (onAuthStateChangedCallback) {
  firebase.auth().onAuthStateChanged(onAuthStateChangedCallback)
}
