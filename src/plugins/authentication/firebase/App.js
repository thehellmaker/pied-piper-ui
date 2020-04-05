import firebase from 'firebase'
import './Init'

const App = {
  getLoggedInUser: () => {
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
  },
  isAuthenticated: () => {
    return !!((App.getLoggedInUser() && App.getLoggedInUser().isEmailVerified === true))
  },
  authenticate: async (email, password) => {
    await firebase.auth().signInWithEmailAndPassword(email, password)
  },
  signup: async (email, password) => {
    const user = await firebase.auth().createUserWithEmailAndPassword(email, password)
    await user.user.sendEmailVerification()
    return `Check your email for verification mail before logging in`
  },
  forgotPassword: async (email) => {
    await firebase.auth().sendPasswordResetEmail(email)
    return (`Reset password link sent to ${email}`)
  },
  logout: async () => {
    await firebase.auth().signOut()
  },
  onAuthStateChanged: (onAuthStateChangedCallback) => {
    firebase.auth().onAuthStateChanged(onAuthStateChangedCallback)
  }
}

export default App
