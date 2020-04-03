import firebase from 'firebase'

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
  return (this.getLoggedInUser() && this.getLoggedInUser().isEmailVerified === true) ? true : false
}

export async function authenticate (email, password) {
  try {
    const user = await firebase.auth().signInWithEmailAndPassword(email, password)
    if (firebase.auth().currentUser.emailVerified === true) {
      alert(`You are Logged in as ${user.user.email}`)
    } else {
      alert(`Please verify your email by logging in to ${user.user.email}`)
    }
  } catch (err) {
    alert(err.message)
  }
}
export async function signup (email, password) {
  try {
    const user = await firebase.auth().createUserWithEmailAndPassword(email, password)
    user.user.sendEmailVerification()
    alert(`Check your email for verification mail before logging in`)
  } catch (err) {
    alert(err.message)
  }
}

export async function forgotPassword (email) {
  try {
    await firebase.auth().sendPasswordResetEmail(email)
    alert(`Reset password link sent to ${email}`)
  } catch (err) {
    alert(err.message)
  }
}

export async function logout () {
  await firebase.auth().signOut()
}

// (main.ts)
export function onAuthStateChanged (onAuthStateChangedCallback) {
  firebase.auth().onAuthStateChanged(onAuthStateChangedCallback)
}
