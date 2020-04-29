import firebase from 'firebase/app'
import 'firebase/auth'
import './Init'

const App = {
  firebase: firebase,
  getLoggedInUser: () => {
    const currentUser = App.firebase.auth().currentUser
    if (currentUser) {
      return {
        email: currentUser.email,
        userId: currentUser.uid,
        isEmailVerified: currentUser.emailVerified
      }
    } else {
      return undefined
    }
  },
  isAuthenticated: () => {
    return (App.getLoggedInUser() && App.getLoggedInUser().isEmailVerified)
  },
  authenticate: async (email, password) => {
    await App.firebase.auth().signInWithEmailAndPassword(email, password)
  },
  signup: async (email, password) => {
    const userCredential = await App.firebase.auth().createUserWithEmailAndPassword(email, password)
    await userCredential.user.sendEmailVerification()
    return `Check your email for verification mail before logging in`
  },
  forgotPassword: async (email) => {
    await App.firebase.auth().sendPasswordResetEmail(email)
    return (`Reset password link sent to ${email}`)
  },
  logout: async () => {
    await App.firebase.auth().signOut()
  },
  onAuthStateChanged: (onAuthStateChangedCallback) => {
    App.firebase.auth().onAuthStateChanged(onAuthStateChangedCallback)
  }
}

export default App
